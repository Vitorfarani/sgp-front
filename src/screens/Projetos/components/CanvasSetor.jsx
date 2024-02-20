import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { CustomOffCanvas, DateInput, FeedbackError, SelectAsync } from '@/components/index';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { isSet } from '@/utils/helpers/is';
import { listColaboradores } from '@/services/colaborador/colaboradores';
import { dateValidation, validateSchema } from '@/utils/helpers/yup';
import { setorSchema } from '../validations';
import { listSetores } from '@/services/setores';

const MOCK_setor = {
  setor: null,
  principal: false,
  inicio: '',
  fim: null,
}
const CanvasSetor = forwardRef(({ listParams, onSave, ...props }, ref) => {
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
    open(form = MOCK_setor, index) {
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
      setformData(MOCK_setor)
    }, 400);
  }

  const handleSubmit = useCallback((event) => {
      if (formData.inicio == '') {
        formData.inicio = null
      }
      if (formData.fim == '') {
        formData.fim = null
      }

    validateSchema(setorSchema, formData)
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
    <CustomOffCanvas title="Setor" show={show} onHide={close} placement="end" name="setor">
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        {isSet(formData.setor) && (
          <Form.Group className='mb-4'>
            <Form.Label>Setor</Form.Label>
            <SelectAsync
              placeholder=""
              loadOptions={(search) => listSetores(`?search=${search}`)}
              value={formData.setor}
              getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
              isInvalid={!!errors.setor}
              onChange={(setor) => handleForm('setor', setor)} />
            <FeedbackError error={errors.setor} />
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
            <DateInput value={formData.fim} onChangeValid={date => handleForm('fim', date)}
              isInvalid={!!errors.fim}
            />
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

export default CanvasSetor;