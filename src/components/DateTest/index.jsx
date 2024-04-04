import React from 'react';
import { Form } from 'react-bootstrap';

const DateTest = ({ id, value, label, placeholder, onChange }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor={id} style={{ marginRight: '10px' }}>{label}</label>
          <Form.Control
            type="date"
            id={id}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
};

export default DateTest;