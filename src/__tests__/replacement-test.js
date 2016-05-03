/* eslint-env mocha */
import assert from 'power-assert';
import {shallow, mount} from 'enzyme';
import React, {PropTypes} from 'react';
import Replacement, {createReplacement} from '../replacement';

describe('<Replacement />', () => {
  let Dummy = () => null;
  Dummy.contextTypes = {componentReplacements: PropTypes.object};

  const value = () => 'value';
  const value2 = () => 'value2';

  it('provides component replacements in child context', () => {
    const wrapper = mount(<Replacement test={value}><Dummy /></Replacement>);
    const child = wrapper.find(Dummy);
    assert(typeof child.node.context.componentReplacements === 'object');
    assert(child.node.context.componentReplacements.test === value);
  });

  it('inherits component replacements from parent context', () => {

    const wrapper = mount(
      <Replacement test={value}>
        <Replacement test2={value2}>
          <Dummy />
        </Replacement>
      </Replacement>
    );
    const child = wrapper.find(Dummy);
    assert(typeof child.node.context.componentReplacements === 'object');
    assert(child.node.context.componentReplacements.test === value);
    assert(child.node.context.componentReplacements.test2 === value2);
  });

  it('overrides inherited component replacements', () => {
    const wrapper = mount(
      <Replacement test={value}>
        <Replacement test={value2}>
          <Dummy />
        </Replacement>
      </Replacement>
    );
    const child = wrapper.find(Dummy);
    assert(typeof child.node.context.componentReplacements === 'object');
    assert(child.node.context.componentReplacements.test === value2);
  });

  it("errors if component replacements aren't functions", () => {
    assert.throws(() => {
      shallow(<Replacement test={'test'}><div /></Replacement>);
    }, /Invariant .+ Invalid prop `test`/);
  });

  it('errors with multiple children', () => {
    assert.throws(() => {
      shallow(<Replacement><div /><div /></Replacement>);
    }, /Invariant .+ one child/);
  });

});

describe('createReplacement', () => {

  it('creates a Replacement class', () => {
    const CustomReplacement = createReplacement();
    assert(typeof CustomReplacement === 'function');
    assert(typeof CustomReplacement.prototype.render === 'function');
  });

  it('gives the Replacement class a default displayName', () => {
    assert(createReplacement().displayName === 'Replacement (custom)');
  });

  it('uses a displayName provided to the factory', () => {
    assert(createReplacement({displayName: 'test'}).displayName === 'test');
  });

  it("errors if component replacements provided to the factory aren't functions", () => {
    assert.throws(() => {
      createReplacement({test: 'test'});
    }, /Invariant .+ Invalid prop `test`/);
  });

});
