/* eslint-env jest */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import bindDefaultProps from '../bindDefaultProps';
import renderer from 'react-test-renderer';

describe('bindDefaultProps', () => {
  const ReplacedComponent = ({test}) => <span>{test}</span>; // eslint-disable-line react/prop-types

  class Context extends Component {
    getChildContext() {
      return {replacedComponent: ReplacedComponent};
    }
    render() {
      return this.props.children;
    }
  }

  Context.propTypes = {children: PropTypes.element};
  Context.childContextTypes = {replacedComponent: PropTypes.func};

  it('applies props to the replaced component', () => {
    const Test = bindDefaultProps({test: 'value'});
    const tree = renderer
      .create(
        <Context>
          <Test />
        </Context>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't clobber props passed in by the parent", () => {
    const Test = bindDefaultProps({test: 'value'});
    const tree = renderer
      .create(
        <Context>
          <Test test="value2" />
        </Context>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
