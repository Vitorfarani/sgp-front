import React from 'react';
import { Badge, Container } from 'react-bootstrap';
import './style.scss';

const ConhecimentoBadge = ({conhecimento}) => {
  const {color, nome, link} = conhecimento;
  return (
    <div className='badge-color shadow bg-primary' title={link}
      onClick={!!link ? () => window.open(link, '_blank') : null} 
      ref={(node) => {
        if (node && color) {
          node.style.setProperty("background-color", color, "important");
        }
      }}>
        <span>
      {nome}

        </span>
      </div>

  );
}

export default ConhecimentoBadge;