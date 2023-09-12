import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { CustomOffCanvas, DateInput, FeedbackError, SelectAsync } from '@/components/index';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { isSet } from '@/utils/helpers/is';
import { listColaboradores } from '@/services/colaborador/colaboradores';
import { dateValidation, validateSchema } from '@/utils/helpers/yup';
import { responsavelSchema } from '../validations';

const MOCK_responsavel = {
  responsavel: null,
  inicio: '',
  fim: null,
}
const CanvasResponsavel = forwardRef(({ listParams, onSave, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(true);
  const [index, setIndex] = useState();
  
  function handleForm(propertyName, newValue) {
    console.log(newValue)
    setformData((prevState) => ({
      ...prevState,
      [propertyName]: newValue
    }));
  };

  useImperativeHandle(ref, () => ({
    //exporta função para component pai
    open(form = MOCK_responsavel, index) {
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
      setformData(MOCK_responsavel)
    }, 400);
  }

  const handleSubmit = useCallback((event) => {
    validateSchema(responsavelSchema, formData)
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
    <CustomOffCanvas title="Responsável" show={show} onHide={close} placement="end" name="responsavel">
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        {isSet(formData.responsavel) && (
          <Form.Group className='mb-4'>
            <Form.Label>Responsável</Form.Label>
            <SelectAsync
              placeholder=""
              loadOptions={(search) => listColaboradores(`${listParams}&search=${search}`)}
              value={formData.responsavel}
              isInvalid={!!errors.responsavel}
              onChange={(responsavel) => handleForm('responsavel', responsavel)} />
            <FeedbackError error={errors.responsavel} />
          </Form.Group>
        )}
        {isSet(formData.inicio) && (
          <Form.Group className='mb-4'>
            <Form.Label>Data de Início</Form.Label>
            <DateInput
              value={formData.inicio}
              onChangeValid={date => handleForm('inicio', date)}
              isInvalid={!!errors.inicio} />
            <FeedbackError error={errors.inicio} />
          </Form.Group>
        )}
        {isSet(formData.fim) && (
          <Form.Group className='mb-4'>
            <Form.Label>Data de Fim</Form.Label>
            <DateInput value={formData.fim} onChangeValid={date => handleForm('fim', date)} />
            <FeedbackError error={errors.fim} />
          </Form.Group>
        )}
        <Col md={'auto'} className='mx-auto'>
          <Button type="submit">Salvar</Button>
        </Col>
      </Form>
    </CustomOffCanvas>
  );
})

export default CanvasResponsavel;