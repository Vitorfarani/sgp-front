import React from 'react';
import { Badge, Container } from 'react-bootstrap';
import './style.scss';

const BadgeColor = ({color, children}) => {
  return (
    <div className='badge bg-primary' 
      ref={(node) => {
        if (node && color) {
          node.style.setProperty("background-color", color, "important");
        }
      }}>
        <span>
      {children}

        </span>
      </div>

  );
}

export default BadgeColor;