import React, {Children} from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

function getValidReplacement(props, key, displayName) {
  const invalid = PropTypes.checkPropTypes(
    {[key]: PropTypes.func},
    props,
    'prop',
    displayName
  );
  invariant(!invalid, (invalid && invalid.message) || 'invalid replacement');
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

export function createReplacement(nameOrProps = {}, props) {
  let displayName = 'Replacement (custom)';
  if (typeof nameOrProps === 'string') {
    displayName = nameOrProps;
    props = props || {};
  } else {
    props = nameOrProps;
    if (props.displayName) {
      displayName = props.displayName;
    }
  }

  class Replacement extends React.Component {
    getChildContext() {
      return {
        componentReplacements: this.getComponentReplacements(),
      };
    }

    getComponentReplacements() {
      const {componentReplacements = {}} = this.context;
      return Object.assign(
        {},
        componentReplacements,
        extractReplacements(this.props, this.constructor.displayName)
      );
    }

    render() {
      return Children.only(this.props.children);
    }
  }

  Replacement.displayName = displayName;

  Replacement.propTypes = {
    children: PropTypes.element.isRequired,
  };

  Replacement.defaultProps = extractReplacements(
    props,
    Replacement.displayName
  );

  Replacement.contextTypes = {
    componentReplacements: PropTypes.object,
  };

  Replacement.childContextTypes = {
    componentReplacements: PropTypes.object.isRequired,
  };

  return Replacement;
}

export default createReplacement({displayName: 'Replacement'});
