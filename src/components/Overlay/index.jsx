import React from 'react';
import './style.scss';

const Overlay = ({ children, description, ...props}) => {
  return (
    <div role="dialog" aria-modal="true" className="fade modal show overlay" style={{}}  {...props}>
      {/* <div className="modal-dialog" style={{pointerEvents: 'all'}}> */}
        {children}
      {/* </div> */}
      {description && <strong>{description}</strong>}

    </div>
  );
}

export default Overlay;