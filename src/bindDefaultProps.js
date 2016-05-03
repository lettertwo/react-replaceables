import {PropTypes} from 'react';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import defaultProps from 'recompose/defaultProps';
import componentFromProp from 'recompose/componentFromProp';

const replacedContext = {replacedComponent: PropTypes.func.isRequired};


export default function bindDefaultProps(props) {
  const enhance = compose(defaultProps(props), getContext(replacedContext));
  return enhance(componentFromProp('replacedComponent'));
}
