import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function DatePicker(props) {
  const handleDateChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
      <Form.Control
        type="date"
        // format="dd/MM/yyyy"
        placeholder="dd/mm/yyyy"
        onChange={handleDateChange}
        {...props}
      />
  );
}

export default DatePicker;
