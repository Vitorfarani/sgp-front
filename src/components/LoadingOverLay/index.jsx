import React from 'react';
import './style.scss';
import { Overlay } from '..';

const LoadingOverLay = ({ label, size = '6rem' }) => {
  return (
    <Overlay description={label}>
        <div className="spinner-border" style={{width: size, height: size, borderWidth: '0.59rem'}}> 
        </div>
    </Overlay>
  );
}

export default LoadingOverLay;