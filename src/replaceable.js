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
    render() {
      const {componentReplacements: replacements = {}} = this.context;
      const {[displayName]: ReplacementComponent = Component} = replacements;
      return <ReplacementComponent {...this.props} />;
    },
  });

}
