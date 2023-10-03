import React from 'react';
import { Button, Row, Spinner } from 'react-bootstrap';
import './style.scss'
import { ENV } from '@/constants/ENV';

const BtnLoginGovBr = ({isLoading, onClick}) => {
  return (
    <Button variant='default' className="gov-br-button" onClick={onClick}>
      <Row>
        <strong style={{color: 'white'}}>
          Entrar com
        </strong>
      </Row>
      <img
        style={{ width: '45%' }}
        src={ENV.HOST+"/assets/logo-gov.svg"}

      />
      {isLoading && <Spinner style={{marginLeft: 10, position: 'absolute'}} animation="grow" size="" />}
  </Button>
  );
}

export default BtnLoginGovBr;