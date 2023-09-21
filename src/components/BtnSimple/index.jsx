import React from 'react';
import { Spinner } from 'react-bootstrap';
import './style.scss'

const BtnSimple = ({ isLoading, Icon, color, onClick, style, children }) => {
  return (
    <button className='btn-simple' type='button' style={style} onClick={onClick}>
      {isLoading ? <Spinner style={{ marginRight: 6 }} animation="border" size="" /> :
        Icon && (<Icon size={'1.6em'}  style={{ marginRight: 6,fontWeight: 'bold' }} />)
      }
      <span style={{color: !!color ? color : null}}>
      {children}
      </span>
    </button>
  );
}

export default BtnSimple;