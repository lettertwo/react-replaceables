import React, {Children, PropTypes} from 'react';
import invariant from 'invariant';

function getValidReplacement(props, key, displayName) {
  const invalid = PropTypes.func(props, key, displayName, 'prop');
  invariant(!invalid, invalid && invalid.message);
  return props[key];
}

const blacklist = {children: 1, displayName: 1};

function extractReplacements(props, displayName) {
  return Object.keys(props).reduce((m, k) => {
    if (blacklist[k]) return m;
    m[k] = getValidReplacement(props, k, displayName);
    return m;
  }, {});
}


export function createReplacement(props = {}) {

  class Replacement extends React.Component {
    getChildContext() {
      return {
        componentReplacements: this.getComponentReplacements(),
      };
    }

    getComponentReplacements() {
      const {componentReplacements = {}} = this.context;
      return Object.assign({},
        componentReplacements,
        extractReplacements(this.props, this.constructor.displayName)
      );
    }

    render() {
      return Children.only(this.props.children);
    }
  }

  Replacement.displayName = props.displayName || 'Replacement (custom)';

  Replacement.propTypes = {
    children: PropTypes.element.isRequired,
  };

  Replacement.defaultProps = extractReplacements(props, Replacement.displayName);

  Replacement.contextTypes = {
    componentReplacements: PropTypes.object,
  };

  Replacement.childContextTypes = {
    componentReplacements: PropTypes.object.isRequired,
  };

  return Replacement;
}

export default createReplacement({displayName: 'Replacement'});
