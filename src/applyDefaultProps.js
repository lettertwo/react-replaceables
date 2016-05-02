import React, {PropTypes} from 'react';


export default function applyDefaultProps(props) {

  class PartiallyAppliedDefaultProps extends React.Component {
    render() {
      const {replacedComponent: Component} = this.context;
      return <Component {...props} {...this.props} />;
    }
  }

  PartiallyAppliedDefaultProps.contextTypes = {
    replacedComponent: PropTypes.func.isRequired,
  };

  return PartiallyAppliedDefaultProps;
}
