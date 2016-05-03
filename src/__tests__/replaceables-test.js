/* eslint-env mocha */
import assert from 'power-assert';
import {mount} from 'enzyme';
import React from 'react';
import {default as replaceableActual} from '../replaceable';
import {default as ReplacementActual} from '../replacement';
import {default as bindDefaultPropsActual} from '../bindDefaultProps';
import Replacement, {
  replaceable,
  bindDefaultProps,
  Replacement as ReplacementNamed,
} from '../index';


describe('replaceables', () => {

  it('exports the Replacement component as default', () => {
    assert(Replacement === ReplacementActual);
  });

  it('exports the Replacement component', () => {
    assert(ReplacementNamed === ReplacementActual);
  });

  it('exports the replaceable decorator', () => {
    assert(replaceable === replaceableActual);
  });

  it('exports the bindDefaultProps util', () => {
    assert(bindDefaultProps === bindDefaultPropsActual);
  });

  describe('in a rendered component', () => {
    const Replaceable = replaceable(function Replaceable() { return <span>replaceme</span>; });

    it('shallowly replaces components', () => {
      const wrapper = mount(
        <Replacement Replaceable={() => <span>test</span>}>
          <Replaceable />
        </Replacement>
      );
      assert(wrapper.find(Replaceable).text() === 'test');
    });

    it('deeply replaces components', () => {
      const wrapper = mount(
        <Replacement Replaceable={() => <span>test</span>}>
          <div>
            <Replaceable />
            <span>decoy</span>
          </div>
        </Replacement>
      );
      assert(wrapper.find(Replaceable).text() === 'test');
    });

  });

});
