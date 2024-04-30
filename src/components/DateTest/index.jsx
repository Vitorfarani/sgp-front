import React from 'react';
import { Form } from 'react-bootstrap';

const DateTest = ({ id, value, label, placeholder, onChange }) => (
  <div style={{ marginBottom: '5px', display: 'flex' }}>
    <label htmlFor={id} style={{display: 'flex', marginTop:'5px', marginRight:'5px'}}>{label}</label>
    <Form.Control
      type="date"
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '170px' }}
    />
  </div>
);

export default DateTest;
