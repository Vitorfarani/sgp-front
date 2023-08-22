import React from 'react';
import './style.scss';

const LoadingOverLay = ({ label, size = '6rem' }) => {
  return (
    <div role="dialog" aria-modal="true" className="fade modal show loading-overlay" >
      <div className="modal-dialog">
        <div className="spinner-border" style={{width: size, height: size, borderWidth: '0.59rem'}}> 
        </div>
      </div>
        {label && <strong>{label}</strong>}
    </div>
  );
}

export default LoadingOverLay;