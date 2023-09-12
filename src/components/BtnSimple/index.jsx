import React from 'react';
import { Spinner } from 'react-bootstrap';
import './style.scss'

const BtnSimple = ({ isLoading, Icon, onClick, children }) => {
  return (
    <button className='btn-simple' type='button' onClick={onClick}>
      {isLoading ? <Spinner style={{ marginRight: 6 }} animation="border" size="" /> :
        Icon && (<Icon size={'1.6em'}  style={{ marginRight: 6,fontWeight: 'bold' }} />)
      }
      <span>
      {children}

      </span>
    </button>
  );
}

export default BtnSimple;