/* eslint-env mocha */
import assert from 'power-assert';
import {mount} from 'enzyme';
import React, {PropTypes} from 'react';
import replaceable from '../replaceable';

const Test = React.createClass({
  displayName: 'TestComponent',
  propTypes: {children: PropTypes.element.isRequired},
  getDefaultProps() { return {children: <span>test</span>}; },
  render() { return this.props.children; },
});
function NamedStateless() {}

describe('replaceable', () => {

  it('allows decorator usage', () => {
    const decorator = replaceable();
    assert(typeof decorator === 'function');
    assert(!decorator.prototype || typeof decorator.prototype.render === 'undefined');
    const ReplacedComponent = decorator(Test);
    assert(typeof ReplacedComponent === 'function');
    assert(typeof ReplacedComponent.prototype.render === 'function');
  });

  it('displays a nice name for the wrapper component', () => {
    assert(replaceable(Test).displayName === 'replaceable(TestComponent)');
    assert(replaceable(NamedStateless).displayName === 'replaceable(NamedStateless)');
  });

  it('uses a provided name for the wrapper component', () => {
    assert(replaceable('test', Test).displayName === 'replaceable(test)');
    assert(replaceable('test')(Test).displayName === 'replaceable(test)');
  });

  it('errors with an anonymous component', () => {
    assert.throws(() => replaceable(() => {}), /Invariant .+ anonymous/);
    assert.throws(() => replaceable(function() {}), /Invariant .+ anonymous/);
  });

  it('errors without a valid React Component', () => {
    const invariantPattern = /Invariant .+ React .+ components/;
    assert.throws(replaceable('test'), invariantPattern);
    assert.throws(() => replaceable('test')({}), invariantPattern);
    assert.throws(() => replaceable('test')('tacos'), invariantPattern);
    assert.throws(() => replaceable('test', {}), invariantPattern);
    assert.throws(replaceable(), invariantPattern);
  });

  it('hoists wrapped Component static properties', () => {
    let C = () => null;
    C.someStaticProp = 'value';
    const TestWithStatics = replaceable('C', C);
    assert('someStaticProp' in TestWithStatics);
    assert(TestWithStatics.someStaticProp === 'value');
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

    const ReplacementTest = React.createClass({
      contextTypes: {replacedComponent: PropTypes.func},
      render() { return <span>replaced</span>; },
    });

    const Context = React.createClass({
      propTypes: {children: PropTypes.node},
      childContextTypes: {componentReplacements: PropTypes.object},
      getChildContext() {
        return {componentReplacements: {TestComponent: ReplacementTest}};
      },
      render() { return this.props.children; },
    });

    it('wraps the replacement', () => {
      const wrapper = mount(<Context><ReplaceableTest /></Context>);
      assert(wrapper.find('replaced(TestComponent)').length === 1);
    });

    it('creates and renders a replacement React element', () => {
      const wrapper = mount(<Context><ReplaceableTest /></Context>);
      assert(wrapper.text() === 'replaced');
    });

    it('forwards props to a replacement element', () => {
      const wrapper = mount(<Context><ReplaceableTest prop="value" /></Context>);
      assert(wrapper.find(ReplaceableTest).prop('prop') === 'value');
    });

    it('provides the replaced component in context', () => {
      const wrapper = mount(<Context><ReplaceableTest /></Context>);
      const child = wrapper.find(ReplacementTest);
      assert(child.node.context.replacedComponent === Test);
    });

  });

});
