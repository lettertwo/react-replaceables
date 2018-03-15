/* eslint-env jest */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import replaceable from '../replaceable';

class Test extends Component {
  render() {
    return this.props.children;
  }
}
Test.displayName = 'TestComponent';
Test.defaultProps = {
  children: <span>test</span>,
};
Test.propTypes = {children: PropTypes.element.isRequired};

function NamedStateless() {}

describe('replaceable', () => {
  it('allows decorator usage', () => {
    const decorator = replaceable();
    expect(typeof decorator).toBe('function');
    expect(decorator.prototype && decorator.prototype.render).toBeUndefined();
    const ReplacedComponent = decorator(Test);
    expect(typeof ReplacedComponent).toBe('function');
    expect(typeof ReplacedComponent.prototype.render).toBe('function');
  });

  it('displays a nice name for the wrapper component', () => {
    expect(replaceable(Test).displayName).toBe('replaceable(TestComponent)');
    expect(replaceable(NamedStateless).displayName).toBe(
      'replaceable(NamedStateless)'
    );
  });

  it('uses a provided name for the wrapper component', () => {
    expect(replaceable('test', Test).displayName).toBe('replaceable(test)');
    expect(replaceable('test')(Test).displayName).toBe('replaceable(test)');
  });

  it('errors with an anonymous component', () => {
    const invariantPattern = /Cannot replace an anonymous component!/;
    expect(() => replaceable(() => {})).toThrow(invariantPattern);
    expect(() => replaceable(function() {})).toThrow(invariantPattern);
  });

  it('errors without a valid React Component', () => {
    const invariantPattern = /Only React .+ components/;
    expect(replaceable('test')).toThrow(invariantPattern);
    expect(() => replaceable('test')({})).toThrow(invariantPattern);
    expect(() => replaceable('test')('tacos')).toThrow(invariantPattern);
    expect(() => replaceable('test', {})).toThrow(invariantPattern);
    expect(replaceable()).toThrow(invariantPattern);
  });

  it('hoists wrapped Component static properties', () => {
    let C = () => null;
    C.someStaticProp = 'value';
    const TestWithStatics = replaceable('C', C);
    expect(TestWithStatics).toHaveProperty('someStaticProp');
    expect(TestWithStatics.someStaticProp).toBe('value');
  });

  describe('without a replacement', () => {
    const ReplaceableTest = replaceable(Test);

    it('creates and renders the wrapped element', () => {
      const tree = renderer.create(<ReplaceableTest />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('forwards props to the wrapped element', () => {
      const tree = renderer.create(<ReplaceableTest prop="value" />);
      expect(tree.root.findByType(Test).instance.props).toMatchObject({
        prop: 'value',
      });
    });
  });

  describe('with a replacement', () => {
    const ReplaceableTest = replaceable(Test);

    class ReplacementTest extends Component {
      render() {
        return <span>replaced</span>;
      }
    }
    ReplacementTest.contextTypes = {replacedComponent: PropTypes.func};

    class Context extends Component {
      getChildContext() {
        return {componentReplacements: {TestComponent: ReplacementTest}};
      }
      render() {
        return this.props.children;
      }
    }
    Context.propTypes = {children: PropTypes.node};
    Context.childContextTypes = {componentReplacements: PropTypes.object};

    it('wraps the replacement', () => {
      const root = renderer.create(
        <Context>
          <ReplaceableTest />
        </Context>
      ).root;
      expect(
        root.find(({type}) => type.displayName === 'replaced(TestComponent)')
      ).toBeDefined();
    });

    it('creates and renders a replacement React element', () => {
      const tree = renderer
        .create(
          <Context>
            <ReplaceableTest />
          </Context>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('forwards props to a replacement element', () => {
      const root = renderer.create(
        <Context>
          <ReplaceableTest prop="value" />
        </Context>
      ).root;
      expect(root.findByType(ReplaceableTest).instance.props).toMatchObject({
        prop: 'value',
      });
    });

    it('provides the replaced component in context', () => {
      const root = renderer.create(
        <Context>
          <ReplaceableTest />
        </Context>
      ).root;
      const child = root.findByType(ReplacementTest).instance;
      expect(child.context.replacedComponent).toBe(Test);
    });
  });
});
