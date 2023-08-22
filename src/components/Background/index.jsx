import React from 'react';
import { Container } from 'react-bootstrap';
import './style.scss';

const Background = ({children}) => {
  return (
    <Container className="background p-3" fluid >
      {children}
      </Container>

  );
}

export default Background;