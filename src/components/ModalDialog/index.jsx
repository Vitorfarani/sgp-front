import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

const ModalDialog = ({
  title,
  color,
  subTitle,
  forms,
  labelSuccess,
  onSuccess,
  labelCancel,
  onCancel,
  ...props
}) => {
  const modal = useRef()
  const [formData, setFormData] = useState({});
 

  function submit() {
    onSuccess(formData)
  }

  
  useEffect(() => {
    if (!!modal.current?.dialog && color) {
      modal.current.dialog.children[0].children[0].style.borderColor = color
    }

  }, [color]);
  return (
    <Modal
      ref={modal}
      {...props}
      size=""
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: 0 }}>
        <Modal.Title id="contained-modal-title-vcenter" style={color && { color: color }}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span dangerouslySetInnerHTML={{ __html: subTitle ?? '' }} ></span>
        {!!forms && (
        <Form style={{marginTop: 20}}>
          {forms.map((form, i) => (
            <Form.Group key={i} className="mb-3" controlId={form.name}>
              <Form.Label><strong> {form.label} </strong></Form.Label>
              <Form.Control
                type={form.type ?? "text"}
                onChange={({target: {value}}) => {
                  setFormData((prev) => ({
                    ...prev,
                    [form.name]: value
                  }));
                }}
                placeholder={form.placeholder ?? ""}
                autoFocus={i == 0}
              />
            </Form.Group>
          ))}
        </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={onCancel}>
          {labelCancel ?? 'Cancelar'}

        </Button>
        <Button variant="primary" style={color && {backgroundColor: color}} onClick={submit}>
          {labelSuccess ?? 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ModalDialog;

// ModalDialog.propTypes = {
//   title: PropTypes.string.isRequired,
//   color: PropTypes.string,
//   subTitle: PropTypes.string,
//   forms: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       type: PropTypes.string,
//       placeholder: PropTypes.string,
//     })
//   ),
//   labelCancel: PropTypes.string,
//   labelSuccess: PropTypes.string,
//   onSuccess: PropTypes.func.isRequired,
// };

