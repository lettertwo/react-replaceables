import React, {PropTypes} from 'react';
import invariant from 'invariant';
import hoistNonReactStatics from 'hoist-non-react-statics';

const hasReplacement = (replacements, replacementName) => {
  if (!replacements || typeof replacements !== 'object') return false;
  return replacementName in replacements;
};

const getReplacement = (replacements, replacementName, DefaultComponent) => {
  if (!hasReplacement(replacements, replacementName)) return DefaultComponent;
  return wrapReplacement(replacementName, replacements[replacementName]);
};

const wrapReplacement = (replacementName, Replacement) => {
  const wrapper = props => <Replacement {...props} />;
  wrapper.displayName = `replaced(${replacementName})`;
  return wrapper;
};

export default function replaceable(name, Component) {
  if (typeof name === 'string' && Component === undefined) {
    return (Wrapped = null) => replaceable(name, Wrapped);
  } else if (name === undefined && Component === undefined) {
    return (Wrapped = null) => replaceable(null, Wrapped);
  } else if (name && !Component) {
    Component = name;
    name = null;
  }

  invariant(
    typeof Component === 'function',
    'Only React Component classes or stateless function components can be replaceable!'
  );

  const replacementName = name || Component.displayName || Component.name;

  invariant(replacementName,
    'Cannot replace an anonymous component!' +
    ' Give your statelss function component a name or displayName property.'
  );


  class Replaceable extends React.Component {
    getChildContext() {
      const {componentReplacements} = this.context;
      if (hasReplacement(componentReplacements, replacementName)) {
        return {replacedComponent: Component};
      }
    }

    render() {
      const {componentReplacements} = this.context;
      const Replacement = getReplacement(componentReplacements, replacementName, Component);
      return <Replacement {...this.props} />;
    }
  }

  Replaceable.displayName = `replaceable(${replacementName})`;
  Replaceable.contextTypes = {componentReplacements: PropTypes.object};
  Replaceable.childContextTypes = {replacedComponent: PropTypes.func};

  hoistNonReactStatics(Replaceable, Component);

  return Replaceable;
}
