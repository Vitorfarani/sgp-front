import React from 'react';
import { Container } from 'react-bootstrap';
import './style.scss';

const Section = ({children, style, className}) => {
  return (
    <section className={`section bg-body-tertiary shadow-sm ${className}`} style={style}>
      {children}
      </section>

  );
}

export default Section;