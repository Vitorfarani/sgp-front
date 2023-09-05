import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const GlobalAlert = forwardRef((props, ref) => {
  const modal = useRef()
  const [isShow, setIsShow] = useState(false);
  const [modalProps, setModalProps] = useState({});

  useEffect(() => {
    if (!!modal.current?.dialog && modalProps.color) {
      modal.current.dialog.children[0].children[0].style.borderColor = modalProps.color
    }
  }, [modalProps.color]);

  function hide() {
    setIsShow(false)
    setTimeout(() => {
      setModalProps({})
    }, 400);
  }

  function show(params) {
      setModalProps(params)
      setIsShow(true)
      if (params.timer) {
        setTimeout(() => {
          hide()
        }, params.timer);
      }
  }
  
  useImperativeHandle(ref, () => ({
    show,
    hide
  }))

  return (
    <Modal
      ref={modal}
      show={isShow}
      onHide={() => hide()}
      size=""
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: 0 }}>
        <Modal.Title id="contained-modal-title-vcenter" style={modalProps.color && { color: modalProps.color }}>
          {modalProps?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 style={modalProps.color && { color: modalProps.color }} >{modalProps.subTitle ?? ''}</h4>
        {!!modalProps?.icon && (
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <modalProps.icon size={60} color={modalProps.color} />
          </div>
        )}
        <p style={modalProps.color && { color: modalProps.color, textAlign: !modalProps?.title && 'center' }}>
          {modalProps.message}
        </p>
      </Modal.Body>
    </Modal>
  );
})
export default GlobalAlert;

