/* eslint-env mocha */
import assert from 'power-assert';
import {shallow, mount} from 'enzyme';
import React, {PropTypes} from 'react';
import replaceable from '../replaceable';

const Test = React.createClass({
  displayName: 'TestComponent',
  render() { return <span>test</span>; },
});
function NamedStateless() {}

describe('replaceable', () => {

  it('allows decorator usage', () => {
    const decorator = replaceable();
    assert(typeof decorator === 'function');
    assert(typeof decorator.prototype.render === 'undefined');
    const ReplacedComponent = decorator(Test);
    assert(typeof ReplacedComponent === 'function');
    assert(typeof ReplacedComponent.prototype.render === 'function');
  });

  it('displays a nice name for the wrapper component', () => {
    assert(replaceable(Test, {}).displayName === 'TestComponent (replaceable)');
    assert(replaceable(NamedStateless, {}).displayName === 'NamedStateless (replaceable)');
  });

  it('errors with an anonymous component', () => {
    assert.throws(() => replaceable(() => {}), /Invariant .+ anonymous/);
    assert.throws(() => replaceable(function() {}), /Invariant .+ anonymous/);
  });

  it('errors without a valid React Component', () => {
    const invariantPattern = /Invariant .+ React .+ components/;
    assert.throws(replaceable(), invariantPattern);
    assert.throws(() => replaceable()({}), invariantPattern);
    assert.throws(() => replaceable()('tacos'), invariantPattern);
    assert.throws(() => replaceable({}), invariantPattern);
    assert.throws(() => replaceable('tacos'), invariantPattern);
  });

  describe('without a replacement', () => {
    const ReplaceableTest = replaceable(Test);

    it('creates and renders the wrapped element', () => {
      const wrapper = mount(<ReplaceableTest />);
      assert(wrapper.text() === 'test');
    });

    it('forwards props to the wrapped element', () => {
      const wrapper = mount(<ReplaceableTest prop="value" />);
      assert(wrapper.prop('prop') === 'value');
    });

  });

  describe('with a replacement', () => {
    const ReplaceableTest = replaceable(Test);
    const Replacement = React.createClass({
      propTypes: {children: PropTypes.node},
      childContextTypes: {componentReplacements: PropTypes.object},
      getChildContext() {
        return {componentReplacements: {
          TestComponent: () => <span>replaced</span>,
        }};
      },
      render() { return this.props.children; },
    });

    it('creates and renders a replacement React element', () => {
      const wrapper = mount(<Replacement><ReplaceableTest /></Replacement>);
      assert(wrapper.text() === 'replaced');
    });

    it('forwards props to a replacement element', () => {
      const wrapper = mount(<Replacement><ReplaceableTest prop="value" /></Replacement>);
      assert(wrapper.find(ReplaceableTest).prop('prop') === 'value');
    });

  });

});
