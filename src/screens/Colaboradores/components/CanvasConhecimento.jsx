import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { CustomOffCanvas, DateInput, FeedbackError, SelectAsync } from '@/components/index';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { isSet } from '@/utils/helpers/is';
import { dateValidation, validateSchema } from '@/utils/helpers/yup';
import { conhecimentoSchema } from '../validations';
import { listConhecimentos } from '@/services/conhecimento/conhecimentos';
import { listConhecimentoNivels } from '@/services/conhecimento/conhecimentoNivel';

const MOCK_conhecimento = {
  conhecimento: null,
  conhecimento_nivel: null,
}
const CanvasConhecimento = forwardRef(({ onSave, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(true);
  const [index, setIndex] = useState();
  
  function handleForm(propertyName, newValue) {
    setformData((prevState) => ({
      ...prevState,
      [propertyName]: newValue
    }));
  };

  useImperativeHandle(ref, () => ({
    //exporta função para component pai
    open(form = MOCK_conhecimento, index) {
      setIndex(index)
      setformData(form)
      setShow(true)
    }
  }));

  function close() {
    setShow(false)
    setTimeout(() => {
      setValidated(false);
      setErrors(true)
      setformData(MOCK_conhecimento)
    }, 400);
  }

  const handleSubmit = useCallback((event) => {
    validateSchema(conhecimentoSchema, formData)
      .then(() => {
        setErrors(true)
        setValidated(true);
        setTimeout(() => {
          onSave(structuredClone(formData), index)
          close()
        }, 400)
      })
      .catch((errors) => {
        setErrors(errors)
        setValidated(false);
      })
    event.preventDefault();
    event.stopPropagation();
  }, [formData]);


  return (
    <CustomOffCanvas title="Conhecimento" show={show} onHide={close} placement="end" name="conhecimento">
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        {isSet(formData.conhecimento) && (
          <Form.Group className='mb-4'>
            <Form.Label>Conhecimento</Form.Label>
            <SelectAsync
              placeholder=""
              loadOptions={listConhecimentos}
              value={formData.conhecimento}
              isInvalid={!!errors.conhecimento}
              onChange={(conhecimento) => handleForm('conhecimento', conhecimento)} />
            <FeedbackError error={errors.conhecimento} />
          </Form.Group>
        )}
        {isSet(formData.conhecimento_nivel) && (
          <Form.Group className='mb-4'>
          <Form.Label>Nivel de conhecimento</Form.Label>
          <SelectAsync
            placeholder=""
            loadOptions={listConhecimentoNivels}
            value={formData.conhecimento_nivel}
            isInvalid={!!errors.conhecimento_nivel}
          getOptionLabel={(option) => option.grau}
            onChange={(conhecimento_nivel) => handleForm('conhecimento_nivel', conhecimento_nivel)} />
          <FeedbackError error={errors.conhecimento_nivel} />
        </Form.Group>
        )}
        <Col md={'auto'} className='mx-auto'>
          <Button type="submit">Salvar</Button>
        </Col>
      </Form>
    </CustomOffCanvas>
  );
})

export default CanvasConhecimento;