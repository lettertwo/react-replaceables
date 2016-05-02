/* eslint-env mocha */
import assert from 'power-assert';
import {mount} from 'enzyme';
import React, {PropTypes} from 'react';
import applyDefaultProps from '../applyDefaultProps';


describe('applyDefaultProps', () => {
  const ReplacedComponent = () => <span>replaced</span>;

  const Context = React.createClass({
    propTypes: {children: PropTypes.element},
    childContextTypes: {replacedComponent: PropTypes.func},
    getChildContext() { return {replacedComponent: ReplacedComponent}; },
    render() { return this.props.children; },
  });

  it('applies props to the replaced component', () => {
    const Test = applyDefaultProps({test: 'value'});
    const wrapper = mount(<Context><Test /></Context>);
    assert(wrapper.find(ReplacedComponent).prop('test') === 'value');
  });

  it("doesn't clobber props passed in by the parent", () => {
    const Test = applyDefaultProps({test: 'value'});
    const wrapper = mount(<Context><Test test="value2" /></Context>);
    assert(wrapper.find(ReplacedComponent).prop('test') === 'value2');
  });

});
