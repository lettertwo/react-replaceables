/* eslint-env jest */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import Replacement, {createReplacement} from '../replacement';

describe('<Replacement />', () => {
  // let Dummy = () => null;
  class Dummy extends Component {
    render() {
      return null;
    }
  }
  Dummy.contextTypes = {componentReplacements: PropTypes.object};

  const value = () => 'value';
  const value2 = () => 'value2';

  it('provides component replacements in child context', () => {
    const tree = renderer.create(
      <Replacement test={value}>
        <Dummy />
      </Replacement>
    );
    const child = tree.root.findByType(Dummy).instance;
    expect(typeof child.context.componentReplacements).toBe('object');
    expect(child.context.componentReplacements.test).toBe(value);
  });

  it('inherits component replacements from parent context', () => {
    const tree = renderer.create(
      <Replacement test={value}>
        <Replacement test2={value2}>
          <Dummy />
        </Replacement>
      </Replacement>
    );
    const child = tree.root.findByType(Dummy).instance;
    expect(typeof child.context.componentReplacements).toBe('object');
    expect(child.context.componentReplacements.test).toBe(value);
    expect(child.context.componentReplacements.test2).toBe(value2);
  });

  it('overrides inherited component replacements', () => {
    const tree = renderer.create(
      <Replacement test={value}>
        <Replacement test={value2}>
          <Dummy />
        </Replacement>
      </Replacement>
    );
    const child = tree.root.findByType(Dummy).instance;
    expect(typeof child.context.componentReplacements).toBe('object');
    expect(child.context.componentReplacements.test).toBe(value2);
  });

  it("errors if component replacements aren't functions", () => {
    expect(() => {
      renderer.create(
        <Replacement test={'test'}>
          <div />
        </Replacement>
      );
    }).toThrow(/Invalid prop `test`/);
  });

  it('errors with multiple children', () => {
    expect(() => {
      renderer.create(
        <Replacement>
          <div />
          <div />
        </Replacement>
      );
    }).toThrow(/React\.Children\.only/);
  });
});

describe('createReplacement', () => {
  it('creates a Replacement class', () => {
    const CustomReplacement = createReplacement();
    expect(typeof CustomReplacement).toBe('function');
    expect(typeof CustomReplacement.prototype.render).toBe('function');
  });

  it('gives the Replacement class a default displayName', () => {
    expect(createReplacement().displayName).toBe('Replacement (custom)');
  });

  it('gives the Replacement class a default displayName (with props)', () => {
    expect(createReplacement({Test: null}).displayName).toBe(
      'Replacement (custom)'
    );
  });

  it('uses a displayName prop provided to the factory', () => {
    expect(createReplacement({displayName: 'test'}).displayName).toBe('test');
  });

  it('uses a displayName provided to the factory', () => {
    expect(createReplacement('test').displayName).toBe('test');
  });

  it('uses a displayName provided to the factory (with props)', () => {
    expect(createReplacement('test', {Test: null}).displayName).toBe('test');
  });

  it("errors if component replacements provided to the factory aren't functions", () => {
    expect(() => {
      createReplacement({test: 'test'});
    }).toThrow(/Invalid prop `test`/);
  });
});
