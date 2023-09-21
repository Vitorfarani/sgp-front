import React, { useEffect } from 'react';
import { useRef } from 'react';
import Form from 'react-bootstrap/Form';

const textareaStyle = {
  border: 'none',
  background: 'transparent',
  overflowY: 'hidden',
  height: 'auto',
  width: '100%',
  fontSize: 30,
  resize: 'none', // Evita que o usuário redimensione o textarea
};
 
const TextareaHided = (props) => {
  const textAreaRef = useRef(null);

  const resizeTextArea = () => {
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  useEffect(() => {
    resizeTextArea()
  }, [props.value]);
  
  return (
    <Form.Control
      ref={textAreaRef}
      {...props}
      rows={1}
      as="textarea"
      style={textareaStyle}
    />
  );
};

export default TextareaHided;
