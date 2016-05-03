/* eslint-env mocha */
import assert from 'power-assert';
import {mount} from 'enzyme';
import React, {PropTypes} from 'react';
import bindDefaultProps from '../bindDefaultProps';


describe('bindDefaultProps', () => {
  const ReplacedComponent = ({test}) => <span>{test}</span>;  // eslint-disable-line react/prop-types

  const Context = React.createClass({
    propTypes: {children: PropTypes.element},
    childContextTypes: {replacedComponent: PropTypes.func},
    getChildContext() { return {replacedComponent: ReplacedComponent}; },
    render() { return this.props.children; },
  });

  it('applies props to the replaced component', () => {
    const Test = bindDefaultProps({test: 'value'});
    const wrapper = mount(<Context><Test /></Context>);
    assert(wrapper.text() === 'value');
  });

  it("doesn't clobber props passed in by the parent", () => {
    const Test = bindDefaultProps({test: 'value'});
    const wrapper = mount(<Context><Test test="value2" /></Context>);
    assert(wrapper.text() === 'value2');
  });

});
