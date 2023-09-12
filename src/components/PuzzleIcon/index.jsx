import React from 'react';
import { FaMountain, FaPuzzlePiece } from 'react-icons/fa';

const PuzzleIcon = ({ color, size }) => {
  const iconStyle = {
    fontSize: size || 24,
    padding: 0,// Define o tamanho do ícone como a prop 'size' ou 24 (padrão)
    color: color || '#fff'
  };
console.log(color)
  return <FaMountain style={iconStyle} />;
};

export default PuzzleIcon;
