import React from 'react';
import './style.scss'; // Estilização do componente

const CircleAvatar = ({ name, size }) => {
  // Função para extrair as iniciais das palavras
  const getInitials = (name) => {
    if(!!name) {
      const words = name.split(' ');
      if (words.length === 1) {
        return name.charAt(0);
      } else {
        return words[0].charAt(0) + words[words.length - 1].charAt(0);
      }
    }
  };

  const initials = getInitials(name);

  const circleStyle = {
    width: size,
    height: size,
  };

  return (
    <div className="circle-avatar" style={circleStyle}>
      <span className="initials">{initials}</span>
    </div>
  );
};

export default CircleAvatar;
