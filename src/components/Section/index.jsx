import React from 'react';
import { Container } from 'react-bootstrap';
import './style.scss';

const Section = ({children, classBg = 'bg-body-tertiary', style, className}) => {
  return (
    <section className={`section  shadow-sm ${className} ${classBg}`} style={style}>
      {children}
      </section>

  );
}

export default Section;