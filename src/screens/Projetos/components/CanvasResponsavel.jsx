import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CustomOffCanvas, DateInput, FeedbackError, SelectAsync, TooltipConhecimentos } from '@/components/index';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { isSet } from '@/utils/helpers/is';
import { listColaboradores } from '@/services/colaborador/colaboradores';
import { dateValidation, validateSchema } from '@/utils/helpers/yup';
import { responsavelSchema } from '../validations';
import { buildQueryString } from '@/utils/helpers/format';
import { listConhecimentoNivels } from '@/services/conhecimento/conhecimentoNivel';

const MOCK_responsavel = {
  responsavel: null,
  inicio: '',
  fim: null,
}
const CanvasResponsavel = forwardRef(({ listParams, onSave, projeto, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState({});
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState(true);
  const [index, setIndex] = useState();
  const [filterByConhecimento, setFilterByConhecimento] = useState(true);
  const [filterBySetor, setFilterBySetor] = useState(true);
  const [filterNivelConhecimento, setFilterNivelConhecimento] = useState(null);
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

  const listparamsColaborador = useMemo(() => {
    let params = [];
    if (filterByConhecimento) params['conhecimentos'] = projeto.projeto_conhecimento.map((c, k) => c.id).join(',')
    if (filterByConhecimento && !!filterNivelConhecimento) params['nivel'] = filterNivelConhecimento.id
    if (filterBySetor) params['setores'] = projeto.projeto_setor.map((s, k) => s.setor.id).join(',');
    return buildQueryString(params, '&');
  }, [filterByConhecimento, filterBySetor, filterNivelConhecimento, show, projeto]);
  return (
    <CustomOffCanvas title={(!formData.id ? "Adicionar " : "Editar ") + "Envolvido"} show={show} onHide={close} placement="end" name="envolvido">
      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Form.Label>Filtrar por:</Form.Label>
        <Form.Group className='mb-1'>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Conhecimentos desse projeto?"
            checked={filterByConhecimento}
            onChange={({ target: { checked } }) => setFilterByConhecimento(checked)}
          />
        </Form.Group>
        {filterByConhecimento && (
          <Form.Group className='mb-4'>
            <SelectAsync
              isClearable
              placeholder="Nivel de conhecimento"
              loadOptions={(search) => listConhecimentoNivels('?search=' + search)}
              value={filterNivelConhecimento}
              getOptionLabel={(option) => option.grau}
              onChange={(value) => setFilterNivelConhecimento(value)} />
          </Form.Group>
        )}
        <Form.Group className='mb-4'>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Setores envolvidos nesse projeto?"
            checked={filterBySetor}
            onChange={({ target: { checked } }) => setFilterBySetor(checked)}
          />
        </Form.Group>
        <hr />

        {isSet(formData.responsavel) && (
          <Form.Group className='mb-4'>
            <Form.Label>Colaborador</Form.Label>
            <SelectAsync
              placeholder=""
              key={JSON.stringify(listparamsColaborador)}
              loadOptions={(search) => listColaboradores('?search=' + search + listparamsColaborador)}
              value={formData.responsavel}
              isInvalid={!!errors.responsavel}
              filterOption={(option) => {
                return !projeto.projeto_responsavel?.map(cc => cc.responsavel.id).includes(option.value)
              }}
              // getOptionLabel={(option) => {
              //   let conhecimentos = option.colaborador_conhecimento.map(e => e.conhecimento.nome + '_' + e.conhecimento_nivel.color).join(',')
              //   return <span title={conhecimentos}>{option.nome}</span>
              // }}
              getOptionLabel={(option) => <TooltipConhecimentos colaborador={option} title={option.nome}/>}
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

export default CanvasResponsavel;