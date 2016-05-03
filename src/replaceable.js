import {PropTypes} from 'react';
import invariant from 'invariant';
import compose from 'recompose/compose';
import withContext from 'recompose/withContext';
import getContext from 'recompose/getContext';
import setDisplayName from 'recompose/setDisplayName';
import componentFromProp from 'recompose/componentFromProp';
import renderComponent from 'recompose/renderComponent';
import isClassComponent from 'recompose/isClassComponent';
import mapProps from 'recompose/mapProps';
import toClass from 'recompose/toClass';
import hoistStatics from 'recompose/hoistStatics';

const contextTypes = {componentReplacements: PropTypes.object};

const hasReplacement = (replacements, replacementName) => {
  if (!replacements || typeof replacements !== 'object') return false;
  return replacementName in replacements;  // eslint-disable-line eqeqeq
};

const getReplacement = (replacements, replacementName, DefaultComponent) => {
  if (!hasReplacement(replacements, replacementName)) return DefaultComponent;
  return replacements[replacementName];
};

const propsWithReplacement = (replacementName, Component) => (
  props => Object.keys(props).reduce((p, k) => {
    if (k === 'componentReplacements') {
      p.replacementComponent = getReplacement(props[k], replacementName, Component);
    } else {
      p[k] = props[k];
    }
    return p;
  }, {})
);

const replacedContextTypes = {replacedComponent: PropTypes.func};

const replacedContext = (replacementName, Component) => (
  ({componentReplacements}) => {
    if (hasReplacement(componentReplacements, replacementName)) {
      return {replacedComponent: Component};
    }
  }
);


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

  const enhance = hoistStatics(compose(
    setDisplayName(`replaceable(${replacementName})`),
    getContext(contextTypes),
    withContext(replacedContextTypes, replacedContext(replacementName, Component)),
    mapProps(propsWithReplacement(replacementName, Component)),
    renderComponent(componentFromProp('replacementComponent'))
  ));

  if (isClassComponent(Component)) return toClass(enhance(Component));
  else return enhance(Component);
}
