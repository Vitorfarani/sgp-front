import React from 'react';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './style.scss';
import { PiQuestionDuotone } from 'react-icons/pi';

const InfoTip = ({children = "", size= 24, ...props}) => {
  return (
    <OverlayTrigger  {...props} overlay={<Tooltip id={Math.random().toString(13).substring(2)}>{props.tipChildren}</Tooltip>}>
       <a href="#" style={{margin: '0 10px'}}>{children}</a>
    </OverlayTrigger>

  );
}

export default InfoTip;