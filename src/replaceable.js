import React, {PropTypes} from 'react';
import invariant from 'invariant';


export default function replaceable(Component) {
  if (Component === undefined) return (Wrapped = null) => replaceable(Wrapped);

  invariant(
    typeof Component === 'function',
    'Only React Component classes or stateless function components can be replaceable!'
  );

  const displayName = Component.displayName || Component.name;

  invariant(displayName,
    'Cannot replace an anonymous component!' +
    ' Give your statelss function component a name or displayName property.'
  );

  return React.createClass({
    displayName: `${displayName} (replaceable)`,
    contextTypes: {componentReplacements: PropTypes.object},
    childContextTypes: {replacedComponent: PropTypes.func},
    getChildContext() {
      if (this.getReplacement()) {
        return {replacedComponent: Component};
      }
    },
    getReplacement() {
      const {componentReplacements = {}} = this.context;
      return componentReplacements[displayName];
    },
    render() {
      const ReplacementComponent = this.getReplacement() || Component;
      return <ReplacementComponent {...this.props} />;
    },
  });

}
