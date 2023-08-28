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
  useEffect(() => {
    if(props.show && props.modalProps.timer) {
      setTimeout(() => {
        props.onHide()
      }, props.modalProps.timer);
    }
  }, [props.show])
  
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
        {!!props.modalProps?.icon && (
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <props.modalProps.icon size={60} color={props.modalProps.color}/>
          </div>
        )}
        <p style={props.modalProps.color && {color: props.modalProps.color, textAlign: !props.modalProps?.title && 'center'}}>
         {props.modalProps.message}
        </p>
      </Modal.Body>
    </Modal>
  );
}
export default GlobalAlert;

