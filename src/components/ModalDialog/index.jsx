import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { FeedbackError, InfoDropdown, SelectAsync } from '..';
import { validateSchema } from '@/utils/helpers/yup';

const ModalDialog = forwardRef(({
  onSuccess,
  onCancel,
  onHide,
  ...props
}, ref) => {
  const modal = useRef()
  const [isShow, setIsShow] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  function hide() {
    setIsShow(false)
    setErrors(false)
    setValidated(false);
    setTimeout(() => {
      setModalProps({})
      setFormData({})
    }, 400);
    onHide()
  }

  function show({ data, ...params }) {
    if (params.forms) params.forms = params.forms.map(f => { f.id = self.crypto.randomUUID(); return f })
    setModalProps(params)
    data && setFormData(data)
    setIsShow(true)
  }

  useImperativeHandle(ref, () => ({
    show,
    hide
  }));

  function submit() {
    if (!!modalProps.forms) {
      document.getElementById('btn-submit-hided').click();
    } else {
      onSuccess()
      hide()
    }
  }

  function onSubmited(event) {
    if (!!modalProps.yupSchema) {
      validateSchema(modalProps.yupSchema, formData)
        .then(() => {
          setErrors(true)
          setValidated(true);
          if (modalProps.method) {
            modalProps.afterSubmit(formData)
              .then((res) => {

                onSuccess(formData)
                hide()

              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            onSuccess(formData)
            hide()

          }


        })
        .catch((errors) => {
          console.log(errors)
          setErrors(errors)
          setValidated(false);
        })

    } else {
      const form = event.currentTarget;
      if (form.checkValidity()) {
        onSuccess(formData)
        hide()

      }
    }
    event.preventDefault();
    event.stopPropagation();
  }


  useEffect(() => {
    if (!!modal.current?.dialog && modalProps.color) {
      modal.current.dialog.children[0].children[0].style.borderColor = modalProps.color
    }
  }, [modalProps.color]);


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
          {modalProps.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span dangerouslySetInnerHTML={{ __html: modalProps.subTitle ?? '' }} ></span>
        {!!modalProps.forms && (
          <Form id="formModalDialog" autoComplete="off" noValidate={!!modalProps.yupSchema} validated={validated} onSubmit={onSubmited} style={{ marginTop: 20 }}>
            {modalProps.forms.map((form, i) => (
              <div key={form.id}>
                {!['select', 'selectAsync'].includes(form.type) && (
                  <Form.Group key={form.id} className="mb-4" >
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
                  <Form.Group key={form.id} className="mb-4" >
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
                  <Form.Group key={form.id} className="mb-4">
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
                      }}
                      {...form} />
                    <FeedbackError error={errors[form.name]} />
                  </Form.Group>
                )}
              </div>
            ))}
            <Button style={{ display: 'none' }} type='submit' id="btn-submit-hided" />
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
       {!!formData.id && <InfoDropdown style={{marginRight: 'auto'}} data={formData}/>}
        <Button variant="default" type="button" onClick={hide}>
          {modalProps.labelCancel ?? 'Cancelar'}

        </Button>
        <Button variant="primary" type="button" style={{ backgroundColor: modalProps.labelSucessColor ?? modalProps.color }} onClick={submit}>
          {modalProps.labelSuccess ?? 'Salvar'}
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

