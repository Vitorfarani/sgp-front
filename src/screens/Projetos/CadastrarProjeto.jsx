import { Background, BtnSimple, CustomOffCanvas, DateInput, DatePicker, FeedbackError, HeaderTitle, Section, SelectAsync, Table, TextareaEditor, ThumbnailUploader } from "@/components/index";
import { listClientes } from "@/services/clientes";
import { listConhecimentos } from "@/services/conhecimentos";
import { listFases } from "@/services/fases";
import { listStatuses } from "@/services/status";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import CanvasResponsavel from "./components/CanvasResponsavel";
import { projetoSchema } from "./validations";
import { validateSchema } from "@/utils/helpers/yup";
import CardResponsavel from "./components/CardResponsavel";
import HorizontalScrollView from "@/components/HorizontalScrollView";
import { isNumber } from "@/utils/helpers/is";
import ListObservacoes from "./components/Observacoes";
import Tabs from "./components/Tabs";
import './style.scss'
import { listSetores } from "@/services/setores";

const MOCK = {
  id: 1,
  nome: '',
  observacao: '',
  descricao: '',
  responsaveis: [],
  conhecimentos: [],
  thumbnail: null,
  cliente: null,
  fase: null,
  situacao: null,
  linkRepositorio: null,
  setor: null,
}



export default function CadastrarProjeto() {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState(MOCK);
  const canvasResponsavelRef = useRef();
  const navigate = useNavigate();
  let params = useParams();
  const listObservacoes = useRef();

  function handleResponsavel(data, index) {
    canvasResponsavelRef.current.open(data, index)
  }

  function saveResponsavel(data, index) {
    let prev = [...formData.responsaveis]
    console.log(index)
    if (isNumber(index)) {
      prev = formData['responsaveis'].map((item, i) => i === index ? data : item)
    } else {
      prev.push(data)
    }
    setformData((prevState) => ({
      ...prevState,
      ['responsaveis']: prev
    }));
  }

  function removeResponsavel(index) {
    setformData((prevState) => ({
      ...prevState,
      ['responsaveis']: prevState['responsaveis'].filter((r, i) => i !== index)
    }));
  }

  function handleForm(propertyName, newValue, subPropertyName = null, index = null) {
    if (subPropertyName) {
      setformData((prevState) => ({
        ...prevState,
        [propertyName]: prevState[propertyName].map((item, i) =>
          i === index
            ? { ...item, [subPropertyName]: newValue }
            : item
        )
      }));
    } else {
      setformData((prevState) => ({
        ...prevState,
        [propertyName]: newValue
      }));
    }
  };

  const handleSubmit = useCallback((event) => {
    validateSchema(projetoSchema, formData)
      .then(() => {
        setErrors(true)
        setValidated(true);

      })
      .catch((errors) => {
        setErrors(errors)
        console.log(errors)
        setValidated(false);
      })
    event.preventDefault();
    event.stopPropagation();
  }, [formData]);


  useEffect(() => {
    console.log(params)
  }, [params]);

  return (
    <Background>
      <HeaderTitle title="Projeto" breadcrumbBlockeds={['editar']} />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Section className={'slim'} >
          <Row>
            <Col md={'auto'}>
              <ThumbnailUploader
                size={60}
                url={formData.thumbnail}
                placeholder={formData.nome}
                onImageChange={(file) => handleForm('thumbnail', file)} />
              <FeedbackError error={errors.thumbnail} />
            </Col>
            <Col className="m-auto">
              <Form.Control
                placeholder="Nome do Projeto"
                value={formData.nome}
                onChange={({ target: { value } }) => handleForm('nome', value)}
                isInvalid={!!errors.nome} />
              <FeedbackError error={errors.nome} />
            </Col>
            <Col md={3} className="m-auto">
              <SelectAsync
                placeholder="Selecione um cliente"
                loadOptions={listClientes}
                value={formData.cliente}
                onChange={(cliente) => handleForm('cliente', cliente)}
                isInvalid={!!errors.cliente} />
              <FeedbackError error={errors.cliente} />
            </Col>
            <Col md={'auto'} className="m-auto">
              <Button type="submit">Salvar</Button>
            </Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <Form.Control
              placeholder="Descrição"
              as="textarea"
              rows={3}
              value={formData.descricao}
              onChange={({ target: { value } }) => handleForm('descricao', value)}
            />
          </Row>
        </Section>
        <Section>
          <Row>
            <SelectAsync
              isMulti
              required
              placeholder="Selecione os Conhecimentos necessários para esse projeto"
              loadOptions={async (search) => {
               return listConhecimentos(search)
                  .then((result) => {
                    return Promise.resolve(result.conhecimentos)
                  })
              }}
              onChange={(conhecimentos) => handleForm('conhecimentos', conhecimentos)}
              isInvalid={!!errors.conhecimentos} />
            <FeedbackError error={errors.conhecimentos} />
          </Row>
        </Section>
        <Row className="m-auto justify-content-center mb-3">
          <BtnSimple Icon={FiPlus} onClick={() => handleResponsavel()}>Adicionar Responsável</BtnSimple>
        </Row>
        {/* <Stack direction="horizontal" className="mx-auto justify-content-center mb-3" gap={formData.responsaveis.length}> */}
        <HorizontalScrollView className="mb-3" style={formData.responsaveis.length <= 1 ? { justifyContent: 'center' } : null}>
          {formData.responsaveis.map((resp, i) => (
            <CardResponsavel
              key={i}
              title={resp.responsavel.label}
              dataInicio={resp.dataInicio}
              dataFim={resp.dataFim}
              onEdit={() => handleResponsavel(resp, i)}
              onRemove={() => removeResponsavel(i)} />
          ))}
        </HorizontalScrollView>
        {/* </Stack> */}
        <Row>
          <Col md={4}>
            <Section>
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm="4" >Gerência</Form.Label>
                <Col sm="8">
                  <SelectAsync
                    loadOptions={listSetores}
                    value={formData.setor}
                    onChange={(setor) => handleForm('setor', setor)}
                    isInvalid={!!errors.setor} />
                  <FeedbackError error={errors.setor} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm="4" >Fase</Form.Label>
                <Col sm="8">
                  <SelectAsync
                    loadOptions={listFases}
                    value={formData.fase}
                    onChange={(fase) => handleForm('fase', fase)}
                    isInvalid={!!errors.fase} />
                  <FeedbackError error={errors.fase} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm="4" >Situação</Form.Label>
                <Col sm="8">
                  <SelectAsync
                    loadOptions={listStatuses}
                    value={formData.situacao}
                    onChange={(situacao) => handleForm('situacao', situacao)}
                    isInvalid={!!errors.situacao} />
                  <FeedbackError error={errors.situacao} />
                </Col>
              </Form.Group>
              <Form.Group >
                <Form.Control
                  placeholder="Link do Repositório"
                  value={formData.repositorio}
                  onChange={({ target: { value } }) => handleForm('repositorio', value)}
                  isInvalid={!!errors.repositorio} />
              </Form.Group>
              <Form.Group as={Row} className="mt-4 mb-4">
                  <Form.Label column sm="4">SEI</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder=""
                      value={formData.sei}
                      onChange={({ target: { value } }) => handleForm('sei', value)}
                       />
                  </Col>
                </Form.Group>
            </Section>
            <Section>
              <h4>Contato</h4>
              <Form.Group as={Row} className="mt-4 mb-4">
                  <Form.Label column sm="4">Nome</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder=""
                      value={formData.contato_nome}
                      onChange={({ target: { value } }) => handleForm('contato_nome', value)}
                       />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-4">
                  <Form.Label column sm="4">Email</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={formData.contato_email}
                      onChange={({ target: { value } }) => handleForm('contato_email', value)}
                       />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="">
                  <Form.Label column sm="4">Telefone</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={formData.contato_telefone}
                      onChange={({ target: { value } }) => handleForm('contato_telefone', value)}
                       />
                  </Col>
                </Form.Group>
            </Section>
            <Section>
              <h4>Ambiente Homologação</h4>
              <Form.Group as={Row} className="mt-4 mb-4">
                  <Form.Label column sm="4">Servidor</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder="URL"
                      value={formData.hml_ip}
                      onChange={({ target: { value } }) => handleForm('hml_ip', value)}
                       />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="">
                  <Form.Label column sm="4">Banco</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder="URL"
                      value={formData.hml_banco}
                      onChange={({ target: { value } }) => handleForm('hml_banco', value)}
                       />
                  </Col>
                </Form.Group>
            </Section>
            <Section>
              <h4>Ambiente Produção</h4>
              <Form.Group as={Row} className="mt-4 mb-4">
                  <Form.Label column sm="4">Servidor</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder="URL"
                      value={formData.prod_ip}
                      onChange={({ target: { value } }) => handleForm('prod_ip', value)}
                       />
                  </Col>
                </Form.Group>
              <Form.Group as={Row} className="mb-4">
                  <Form.Label column sm="4">Banco</Form.Label>
                  <Col sm="8">
                    <Form.Control
                      placeholder="URL"
                      value={formData.prod_banco}
                      onChange={({ target: { value } }) => handleForm('prod_banco', value)}
                       />
                  </Col>
                </Form.Group>
            </Section>
          </Col>

          <Col md={8} className="">
            {formData.id && (
             <Tabs projeto={formData}/>
            )}
            
          </Col>
        </Row>
      </Form>
      <CanvasResponsavel ref={canvasResponsavelRef} listParams={`?conhecimentos=${formData.conhecimentos.join(',')}`} onSave={saveResponsavel} />
    </Background>
  );
}
