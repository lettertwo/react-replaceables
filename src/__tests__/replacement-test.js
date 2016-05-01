/* eslint-env mocha */
import assert from 'power-assert';
import {shallow, mount} from 'enzyme';
import React, {PropTypes} from 'react';
import Replacement from '../replacement';

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
});
