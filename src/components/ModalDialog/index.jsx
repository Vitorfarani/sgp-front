import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { FeedbackError, SelectAsync } from '..';
import { validateSchema } from '@/utils/helpers/yup';

const ModalDialog = forwardRef(({
  title,
  color,
  subTitle,
  forms,
  labelSuccess,
  onSuccess,
  labelCancel,
  onCancel,
  labelSucessColor,
  yupSchema,
  data,
  ...props
}, ref) => {
  const modal = useRef()
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  useImperativeHandle(ref, () => ({
    setData: (data) => setFormData(data)
  }));

  function submit() {
    if (!!forms) {
      document.getElementById('btn-submit-hided').click();
    } else {
      onSuccess()
    }
  }

  function onSubmited(event) {
    if (!!yupSchema) {
      validateSchema(yupSchema, formData)
        .then(() => {
          setErrors(true)
          setValidated(true);
          onSuccess(formData)

        })
        .catch((errors) => {
          setErrors(errors)
          setValidated(false);
        })

    } else {
      const form = event.currentTarget;
      if (form.checkValidity()) {
        onSuccess(formData)
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }


  useEffect(() => {
    if (!!modal.current?.dialog && color) {
      modal.current.dialog.children[0].children[0].style.borderColor = color
    }
  }, [color]);

  useEffect(() => {
    console.log(formData)
    if (!props.show) {
      setFormData({})
      setErrors(false)
      setValidated(false);
    }
  }, [props.show]);

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
          <Form id="formModalDialog" autoComplete="off" noValidate={!!yupSchema} validated={validated} onSubmit={onSubmited} style={{ marginTop: 20 }}>
            {forms.map((form, i) => (
              <>
                {!['select', 'selectAsync'].includes(form.type) && (
                  <Form.Group key={i} className="mb-4" controlId={form.name}>
                    <Form.Label><strong> {form.label} </strong></Form.Label>
                    <Form.Control
                      value={formData[form.name]}
                      type={form.type ?? "text"}
                      onChange={({ target: { value } }) => {
                        setFormData((prev) => ({
                          ...prev,
                          [form.name]: value
                        }));
                      }}
                      placeholder={form.placeholder ?? ""}
                      autoFocus={i == 0}
                      isInvalid={!!errors[form.name]}
                      {...form}
                    />
                    <FeedbackError error={errors[form.name]} />
                  </Form.Group>
                )}
                {form.type === 'select' && (
                  <Form.Group key={i} className="mb-4" controlId={form.name}>
                    <Form.Label><strong> {form.label} </strong></Form.Label>
                    <Form.Select
                      value={formData[form.name]}

                      onChange={({ target: { value } }) => {
                        setFormData((prev) => ({
                          ...prev,
                          [form.name]: value
                        }));
                      }}
                      placeholder={form.placeholder ?? ""}
                      autoFocus={i == 0}
                      isInvalid={!!errors[form.name]}
                      {...form}
                    >
                      {form.options.map(({ value, label }, key) => (
                        <option key={key} value={value}>{label}</option>
                      ))}
                    </Form.Select>
                    <FeedbackError error={errors[form.name]} />
                  </Form.Group>
                )}
                {form.type === 'selectAsync' && (
                  <Form.Group key={i} className="mb-4" controlId={form.name}>
                    <Form.Label><strong> {form.label} </strong></Form.Label>
                    <SelectAsync
                      value={formData[form.name]}
                      loadOptions={form.loadOptions}
                      isInvalid={!!errors[form.name]}
                      onChange={value => {
                        setFormData((prev) => ({
                          ...prev,
                          [form.name]: value
                        }));
                      }} />
                    <FeedbackError error={errors[form.name]} />
                  </Form.Group>
                )}
              </>
            ))}
            <Button style={{ display: 'none' }} type='submit' id="btn-submit-hided" />
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" type="button" onClick={onCancel}>
          {labelCancel ?? 'Cancelar'}

        </Button>
        <Button variant="primary" type="button" style={{ backgroundColor: labelSucessColor ?? color }} onClick={submit}>
          {labelSuccess ?? 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
})
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

