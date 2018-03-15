/* eslint-env jest */
import React, {Component} from 'react';
import renderer from 'react-test-renderer';
import {default as replaceableActual} from '../replaceable';
import {default as bindDefaultPropsActual} from '../bindDefaultProps';
import {
  default as ReplacementActual,
  createReplacement as createReplacementActual,
} from '../replacement';
import Replacement, {
  replaceable,
  bindDefaultProps,
  createReplacement,
  Replacement as ReplacementNamed,
} from '../index';

describe('replaceables', () => {
  it('exports the Replacement component as default', () => {
    expect(Replacement).toBe(ReplacementActual);
  });

  it('exports the Replacement component', () => {
    expect(ReplacementNamed).toBe(ReplacementActual);
  });

  it('exports the replaceable decorator', () => {
    expect(replaceable).toBe(replaceableActual);
  });

  it('exports the bindDefaultProps util', () => {
    expect(bindDefaultProps).toBe(bindDefaultPropsActual);
  });

  it('exports the createReplacement factory', () => {
    expect(createReplacement).toBe(createReplacementActual);
  });

  describe('in a rendered component', () => {
    const Replaceable = replaceable(function Replaceable() {
      return <span>replaceme</span>;
    });

    it('shallowly replaces components', () => {
      const tree = renderer
        .create(
          <Replacement Replaceable={() => <span>test</span>}>
            <Replaceable />
          </Replacement>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('deeply replaces components', () => {
      const tree = renderer
        .create(
          <Replacement Replaceable={() => <span>test</span>}>
            <div>
              <Replaceable />
              <span>decoy</span>
            </div>
          </Replacement>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
