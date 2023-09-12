import { Background, BtnSimple, CustomOffCanvas, DateInput, DatePicker, FeedbackError, HeaderTitle, Section, SelectAsync, Table, TextareaEditor, ThumbnailUploader } from "@/components/index";
import { listClientes } from "@/services/clientes";
import { listConhecimentos } from "@/services/conhecimento/conhecimentos";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { FiBriefcase, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import CanvasResponsavel from "./components/CanvasResponsavel";
import { projetoSchema } from "./validations";
import { validateSchema } from "@/utils/helpers/yup";
import CardResponsavel from "./components/CardResponsavel";
import HorizontalScrollView from "@/components/HorizontalScrollView";
import { isNumber } from "@/utils/helpers/is";
import Tabs from "./components/Tabs";
import './style.scss'
import { FaPeopleCarry } from "react-icons/fa";
import { createProjeto, updateProjeto } from "@/services/projeto/projetos";
import { useTheme } from "@/utils/context/ThemeProvider";
import { pessoaNomeAbreviadoMask } from "@/utils/helpers/mask";
import { createProjetoResponsavel, deleteProjetoResponsavel, updateProjetoResponsavel } from "@/services/projeto/projetoResponsavel";
import CanvasSetor from "./components/CanvasSetor";
import CardSetor from "./components/CardSetor";
import { createProjetoSetor, deleteProjetoSetor, mainProjetoSetor, updateProjetoSetor } from "@/services/projeto/projetoSetor";
import { formatForm } from "@/utils/helpers/forms";
import { listProjetoFases } from "@/services/projeto/projetoFases";
import { listProjetoStatus } from "@/services/projeto/projetoStatus";

const MOCK = {
  id: null,
  nome: '',
  descricao: '',
  projeto_setor: [],
  projeto_responsavel: [],
  projeto_conhecimento: [],
  thumbnail: null,
  cliente: null,
  projeto_fase: null,
  projeto_status: null,
  linkRepositorio: '',
  contato_nome: '',
  contato_email: '',
  contato_telefone: '',
  hml_ip: '',
  hml_banco: '',
  prod_ip: '',
  prod_banco: '',
}



export default function CadastrarProjeto() {
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState(MOCK);
  const canvasResponsavelRef = useRef();
  const canvasSetorRef = useRef();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  let params = useParams();
  const listObservacoes = useRef();

  function handleResponsavel(data, index) {
    canvasResponsavelRef.current.open(data, index)
  }
  function handleSetor(data, index) {
    canvasSetorRef.current.open(data, index)
  }

  function saveResponsavel(data, index) {
    if (!formData.id) {
      let prev = [...formData.projeto_responsavel]
      if (isNumber(index)) {
        prev = formData['projeto_responsavel'].map((item, i) => i === index ? data : item)
      } else {
        prev.push(data)
      }
      setformData((prevState) => ({
        ...prevState,
        ['projeto_responsavel']: prev
      }));
    } else {
      data.projeto_id = formData.id;
      data.colaborador_id = data.responsavel.id;

      handleGlobalLoading.show()
      let method = !data.id ? createProjetoResponsavel : updateProjetoResponsavel;
      method(data)
        .then((result) => {
          callGlobalNotify({ message: result.message, variant: 'success' })
          load(params.id)
        })
        .catch((error) => {
          callGlobalAlert(error)
          handleGlobalLoading.hide()
        })
    }

  }

  function removeResponsavel(index) {
    if (!formData.id) {
      setformData((prevState) => ({
        ...prevState,
        ['projeto_responsavel']: prevState['projeto_responsavel'].filter((r, i) => i !== index)
      }));
    } else {
      let pr = formData['projeto_responsavel'][index];
      callGlobalDialog({
        title: 'Excluir Responsável',
        subTitle: 'Tem certeza que deseja excluir esse responsável do projeto?',
        color: 'red',
        labelSuccess: 'Excluir',
      })
        .then(() => {
          handleGlobalLoading.show()
          deleteProjetoResponsavel(pr.id)
            .then((result) => {
              callGlobalNotify({ message: result.message, variant: 'danger' })
              load(params.id)
            })
            .catch((error) => {
              callGlobalAlert(error)
              handleGlobalLoading.hide()
            })
        })
    }
  }

  function saveSetor(data, index) {
    if (!formData.id) {
      let prev = [...formData.projeto_setor]
      if (isNumber(index)) {
        prev = formData['projeto_setor'].map((item, i) => i === index ? data : item)
      } else {
        prev.push(data)
      }
      setformData((prevState) => ({
        ...prevState,
        ['projeto_setor']: prev
      }));
    } else {
      data.projeto_id = formData.id;
      data.setor_id = data.setor.id;

      handleGlobalLoading.show()
      let method = !data.id ? createProjetoSetor : updateProjetoSetor;
      method(data)
        .then((result) => {
          callGlobalNotify({ message: result.message, variant: 'success' })
          load(params.id)
        })
        .catch((error) => {
          callGlobalAlert(error)
          handleGlobalLoading.hide()
        })
    }

  }

  function removeSetor(index) {
    if (!formData.id) {
      setformData((prevState) => ({
        ...prevState,
        ['projeto_setor']: prevState['projeto_setor'].filter((r, i) => i !== index)
      }));
    } else {
      let pr = formData['projeto_setor'][index];
      callGlobalDialog({
        title: 'Excluir Setor',
        subTitle: 'Tem certeza que deseja excluir esse setor do projeto?',
        color: 'red',
        labelSuccess: 'Excluir',
      })
        .then(() => {
          handleGlobalLoading.show()
          deleteProjetoSetor(pr.id)
            .then((result) => {
              callGlobalNotify({ message: result.message, variant: 'danger' })
              load(params.id)
            })
            .catch((error) => {
              callGlobalAlert(error)
              handleGlobalLoading.hide()
            })
        })
    }
  }
  function handleMainSetor(index) {
    console.log(index)
    if (!formData.id) {
      setformData((prevState) => ({
        ...prevState,
        ['projeto_setor']: prevState['projeto_setor'].map((r, i) => {
          if (i == index) {
            r.principal = true
          } else {
            r.principal = false
          }
          return r;
        })
      }));
    } else {
      let pr = formData['projeto_setor'][index];
      callGlobalDialog({
        title: 'Principal setor responsável ',
        subTitle: 'Tem certeza que deseja adicionar esse setor como setor responsável do projeto?',
        color: 'var(--bs-warning)',
        labelSuccess: 'Sim',
        labelCancel: 'Não',
      })
        .then(() => {
          handleGlobalLoading.show()
          mainProjetoSetor(pr.id)
            .then((result) => {
              callGlobalNotify({ message: result.message, variant: 'danger' })
              load(params.id)
            })
            .catch((error) => {
              callGlobalAlert(error)
              handleGlobalLoading.hide()
            })
        })
    }
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
    console.log('aa')
    validateSchema(projetoSchema, formData)
      .then(() => {
        setErrors({})
        save()
      })
      .catch((errors) => {
        setErrors(errors)
      })
    event.preventDefault();
    event.stopPropagation();
  }, [formData]);

  function beforeSave(form) {
    let data = structuredClone(form);
    data = formatForm(data).rebaseIds(['projeto_status', 'projeto_fase', 'cliente']).getResult()
    if (!data.id) {
      data.projeto_conhecimento = data.projeto_conhecimento.map(c => {
        return {
          ...c,
          conhecimento_id: c.conhecimento.id,
        }
      })
      data.projeto_responsavel = data.projeto_responsavel.map(r => {
        return {
          ...r,
          colaborador_id: r.responsavel.id,
        }
      })
      data.projeto_setor = data.projeto_setor.map(s => {
        return {
          ...s,
          setor_id: c.setor.id,
        }
      })
    }
    return data;

  }
  function save() {
    let data = beforeSave(formData)
    handleGlobalLoading.show()
    let method = !data.id ? createProjeto : updateProjeto;
    method(data)
      .then((res) => {
        callGlobalNotify({ message: res.message, variant: 'success' })
        load()
      })
      .catch((error) => {
        callGlobalAlert(error)
        handleGlobalLoading.hide()
      })
  }
  useEffect(() => {
    console.log(params)
  }, [params]);

  return (
    <Background>
      <HeaderTitle title="Projeto" breadcrumbBlockeds={['editar']} />
      <Form noValidate onSubmit={handleSubmit}>
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
        <Row className="mb-3 px-4 d-flex justify-content-center">
          <Col xs={5} md={2}>
            <h4>Setores</h4>
          </Col>
          <Col xs={'auto'} md={8} className='d-flex justify-content-center align-items-center'>
            <span></span>
          </Col>
          <Col xs={5} md={2}>
            <BtnSimple Icon={FiBriefcase} onClick={() => handleSetor()}>Adicionar Setor</BtnSimple>
          </Col>
        </Row>
        <HorizontalScrollView className="mb-3" style={formData.projeto_setor.length <= 1 ? { justifyContent: 'center' } : null}>
          {formData.projeto_setor.map((setor, i) => (
            <CardSetor
              key={i}
              title={setor.setor.sigla}
              dataInicio={setor.inicio}
              dataFim={setor.fim}
              isMain={setor.principal}
              onMainChange={() => handleMainSetor(i)}
              onEdit={() => handleSetor(setor, i)}
              onRemove={() => removeSetor(i)} />
          ))}
        </HorizontalScrollView>

        <Row className="mb-3 px-4 d-flex justify-content-center">
          <Col md={'auto'}>
            <FeedbackError error={errors.projeto_setor} />
          </Col>
        </Row>

        <Section>
          <Row>
            <SelectAsync
              isMulti
              required
              placeholder="Selecione os Conhecimentos necessários para esse projeto"
              loadOptions={listConhecimentos}
              onChange={(projeto_conhecimento) => handleForm('projeto_conhecimento', projeto_conhecimento)}
              isInvalid={!!errors.projeto_conhecimento} />
            <FeedbackError error={errors.projeto_conhecimento} />
          </Row>
        </Section>
        <Row className="mb-3 px-4">
          <Col xs={5} md={2}>
            <h4>Responsáveis</h4>
          </Col>
          <Col xs={'auto'} md={8} className='d-flex justify-content-center align-items-center'>
            <span></span>
          </Col>
          <Col xs={5} md={2}>
            <BtnSimple Icon={FaPeopleCarry} onClick={() => handleResponsavel()}>Adicionar Responsável</BtnSimple>

          </Col>
        </Row>
        <HorizontalScrollView className="mb-3" style={formData.projeto_responsavel.length <= 1 ? { justifyContent: 'center' } : null}>
          {formData.projeto_responsavel.map((resp, i) => (
            <CardResponsavel
              key={i}
              title={pessoaNomeAbreviadoMask(resp.responsavel.nome)}
              subtitle={resp.responsavel.setor.nome}
              dataInicio={resp.inicio}
              dataFim={resp.fim}
              onEdit={() => handleResponsavel(resp, i)}
              onRemove={() => removeResponsavel(i)} />
          ))}
        </HorizontalScrollView>
            
        <Row className="mb-3 px-4 d-flex justify-content-center">
          <Col md={'auto'}>
            <FeedbackError error={errors.projeto_responsavel} />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Section>
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm="4" >Fase</Form.Label>
                <Col sm="8">
                  <SelectAsync
                    loadOptions={listProjetoFases}
                    value={formData.projeto_fase}
                    onChange={(projeto_fase) => handleForm('projeto_fase', projeto_fase)}
                    isInvalid={!!errors.projeto_fase} />
                  <FeedbackError error={errors.projeto_fase} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm="4" >Situação</Form.Label>
                <Col sm="8">
                  <SelectAsync
                    loadOptions={listProjetoStatus}
                    value={formData.projeto_status}
                    onChange={(projeto_status) => handleForm('projeto_status', projeto_status)}
                    isInvalid={!!errors.projeto_status} />
                  <FeedbackError error={errors.projeto_status} />
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
              <Tabs projeto={formData} />
            )}

          </Col>
        </Row>
      </Form>
      <CanvasResponsavel ref={canvasResponsavelRef} listParams={`?conhecimento=${formData.projeto_conhecimento.join(',')}`} onSave={saveResponsavel} />
      <CanvasSetor ref={canvasSetorRef} onSave={saveSetor} />
    </Background>
  );
}
