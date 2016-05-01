import React, {PropTypes} from 'react';
import invariant from 'invariant';


export default class Replacement extends React.Component {
  getChildContext() {
    return {
      componentReplacements: this.getComponentReplacements(),
    };
  }

  validateReplacement(key) {
    const invalid = PropTypes.node(this.props, key, this.constructor.name, 'prop');
    invariant(!invalid, invalid && invalid.message);
    return this.props[key];
  }

  getComponentReplacements() {
    const {componentReplacements = {}} = this.context;
    const {children, ...replacements} = this.props;  // eslint-disable-line no-unused-vars
    return Object.keys(replacements).reduce(
      (m, k) => {
        m[k] = this.validateReplacement(k);
        return m;
      },
      {...componentReplacements},
    );
  }

  render() {
    return this.props.children;
  }
}

Replacement.propTypes = {
  children: PropTypes.node.isRequired,
};

Replacement.contextTypes = {
  componentReplacements: PropTypes.object,
};

Replacement.childContextTypes = {
  componentReplacements: PropTypes.object.isRequired,
};
