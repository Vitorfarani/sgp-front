import { isString } from '@/utils/helpers/is';
import React from 'react';
import { Form } from 'react-bootstrap';
import './style.scss'

const FeedbackError = ({error}) => {
  // if(!isString(error)) return null;
  return (
    <Form.Control.Feedback  type="invalid">{error}</Form.Control.Feedback>
  );
}

export default FeedbackError;