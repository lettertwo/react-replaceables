// @flow
import React from 'react';
import PropTypes from 'prop-types';

export default function bindDefaultProps(props) {
  class BoundDefaultProps extends React.Component {
    getReplacedComponent() {
      return this.context.replacedComponent;
    }

    render() {
      const ReplacedComponent = this.getReplacedComponent();
      return <ReplacedComponent {...this.props} />;
    }
  }

  BoundDefaultProps.defaultProps = Object.assign({}, props);
  BoundDefaultProps.contextTypes = {
    replacedComponent: PropTypes.func.isRequired,
  };

  return BoundDefaultProps;
}
