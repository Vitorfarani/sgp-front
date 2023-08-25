import moment from 'moment';
import React, { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';

const DateInput = ({value, onChangeValid, placeholder, ...props}) => {
  const [isInvalid, setIsInvalid] = useState(false);

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    onChangeValid(newInputValue)

    // if (moment(newInputValue, 'YYYY-MM-DD', true).isValid()) {
    //   setIsInvalid(false);
    // } else {
    //   setIsInvalid(true);
    // }
  };

  return (
    <>
        <Form.Control
          {...props}
          type="date"
          placeholder={placeholder ?? "DD/MM/YYYY"}
          value={value}
          onChange={handleInputChange}
          // isInvalid={isInvalid ?? props.isInvalid}
          // onFocus={(e) => e.target.type = "date"} // Alterna para input de data nativo ao receber foco
          // onBlur={(e) => e.target.type = "text"} // Alterna de volta para o input de texto ao perder foco
        />
        {/* <Form.Control.Feedback type="invalid">Data inválida.</Form.Control.Feedback> */}
    </>
  );
};

export default DateInput;
