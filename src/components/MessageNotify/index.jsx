import { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaCheck } from 'react-icons/fa';

const MessageNotify = (props) => {
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
      className='modal-notify'
      ref={modal}
      transparent={true}
      {...props}
    >
      <Modal.Body
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 20}}>
          <FaCheck size={30} style={props.modalProps.color && {color: props.modalProps.color}} />
        </div>
        <p style={props.modalProps.color && {color: props.modalProps.color, textAlign: !props.modalProps?.title && 'center', margin: 0}}>
         {props.modalProps.message}
        </p>
      </Modal.Body>
    </Modal>
  );
}
export default MessageNotify;

