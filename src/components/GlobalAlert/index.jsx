import { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const GlobalAlert = (props) => {
  const modal = useRef()

  useEffect(() => {
    if (!!modal.current?.dialog && props.modalProps.color) {
      modal.current.dialog.children[0].children[0].style.borderColor = props.modalProps.color
    }
  }, [props.modalProps.color]);
  
  return (
    <Modal
      ref={modal}
      {...props}
      size=""
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{border: 0}}>
        <Modal.Title id="contained-modal-title-vcenter" style={props.modalProps.color && {color: props.modalProps.color}}>
          {props.modalProps?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 style={props.modalProps.color && {color: props.modalProps.color}} >{props.modalProps.subTitle ?? ''}</h4>
        <p style={props.modalProps.color && {color: props.modalProps.color}}>
         {props.modalProps.message}
        </p>
      </Modal.Body>
    </Modal>
  );
}
export default GlobalAlert;

