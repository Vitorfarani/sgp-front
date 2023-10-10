import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Background, BtnSimple, CustomOffCanvas, DateInput, DatePicker, FeedbackError, HeaderTitle, HorizontalScrollview, Section, SelectAsync, Table, TextareaEditor, ThumbnailUploader } from "@/components/index";
import ReactInputMask from "react-input-mask";
import { listSetores } from "@/services/setores";
import { validateSchema } from "@/utils/helpers/yup";
import { colaboradorSchema } from "./validations";
import './style.scss'
import { formatForm } from "@/utils/helpers/forms";
import { createColaborador, showColaborador, updateColaborador } from "@/services/colaborador/colaboradores";
import { useTheme } from "@/utils/context/ThemeProvider";
import { FaBrain, FaHistory, FaPlus } from "react-icons/fa";
import CardConhecimento from "./components/CardConhecimento";
import CanvasConhecimento from "./components/CanvasConhecimento";
import { isNumber } from "@/utils/helpers/is";
import { createColaboradorConhecimento, deleteColaboradorConhecimento, updateColaboradorConhecimento } from "@/services/colaborador/colaboradorConhecimento";
import { listEmpresas } from "@/services/empresas";
import { listFuncao } from "@/services/funcoes";
import { FiClock, FiInfo } from "react-icons/fi";
import { listVinculo } from "@/services/vinculos";
import { dateEnToPt } from "@/utils/helpers/date";

const MOCK_VINCULO = {
  carga_horaria: 8,
  empresa: null,
  funcao: null,
  data_inicio: '',
  data_fim: null,
  segunda: true,
  terca: true,
  quarta: true,
  quinta: true,
  sexta: true,
}
const MOCK = {
  id: null,
  thumbnail: null,
  nome: '',
  email: '',
  cpf: '',
  pr: '',
  telefone: '',
  active: true,
  user_active: true,
  nascimento: '',
  setor: null,
  colaborador_conhecimento: [],
  vinculo: MOCK_VINCULO
}

const weekdays = {
  'segunda': 'Segunda',
  'terca': 'Terça',
  'quarta': 'Quarta',
  'quinta': 'Quinta',
  'sexta': 'Sexta'
};


//Todo: finalizar vinculo
export default function CadastrarColaborador() {
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState(MOCK);
  const [showHistoryVinculo, setShowHistoryVinculo] = useState(false);
  const [historyVinculo, setHistoryVinculo] = useState([]);
  const [showBtnNewVinculo, setShowBtnNewVinculo] = useState(true);
  let params = useParams();
  const navigate = useNavigate();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const canvasConhecimentoRef = useRef();

  function beforeEdit(results) {
    results['colaborador_conhecimento'] = results['colaborador_conhecimento'].map(pc => ({
      ...pc,
      colaborador_conhecimento_id: pc.id
    }))
    results['user_active'] = results.user?.active ?? true;
    results['vinculo'] = !results.vinculo ? MOCK_VINCULO : results.vinculo;

    return results
  }
  function handleToggleHistoryVinculo() {
    
    if (showHistoryVinculo) {
      setHistoryVinculo([])
      setShowHistoryVinculo(false)
    } else {
      handleGlobalLoading.show()
      listVinculo('?colaborador_id=' + formData.id)
        .then((results) => {
          let resultsFiltered = results.filter(e => e.id !== formData.vinculo.id);
          if(resultsFiltered.length > 0) {
            setShowHistoryVinculo(true)
            setHistoryVinculo(resultsFiltered)
          } else {
            callGlobalNotify({message: 'O vinculo atual é o único desse colaborador', icon: FiInfo})
          }

        })
        .catch(callGlobalAlert)
        .finally(handleGlobalLoading.hide)
    }
  }
  const load = async (id) => {
    setErrors({})
    handleGlobalLoading.show()
    showColaborador(id)
      .then((results) => {
        setformData(beforeEdit(results))
      })
      .catch(callGlobalAlert)
      .finally(handleGlobalLoading.hide)
  }

  function handleConhecimento(data, index) {
    canvasConhecimentoRef.current.open(data, index)
  }

  function saveConhecimento(data, index) {
    if (!formData.id) {
      let prev = [...formData.colaborador_conhecimento]
      if (isNumber(index)) {
        prev = formData['colaborador_conhecimento'].map((item, i) => i === index ? data : item)
      } else {
        prev.push(data)
      }
      setformData((prevState) => ({
        ...prevState,
        ['colaborador_conhecimento']: prev
      }));
    } else {
      data.colaborador_id = formData.id;
      data.conhecimento_id = data.conhecimento.id;
      data.conhecimento_nivel_id = data.conhecimento_nivel.id;

      handleGlobalLoading.show()
      let method = !data.id ? createColaboradorConhecimento : updateColaboradorConhecimento;
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
  function newVinculo() {
    let prev = [...historyVinculo];
    setShowBtnNewVinculo(false)
    setShowHistoryVinculo(true)
    prev.push(formData.vinculo)
    setHistoryVinculo(prev)
    setformData((prevState) => ({
      ...prevState,
      ['vinculo']: { ...MOCK_VINCULO, isNew: true }
    }));
  }
  // function saveNewVinculo(params) {
  //   let data = formatForm(form)
  //   handleGlobalLoading.show()
  //   let method = !data.id ? createColaboradorConhecimento : updateColaboradorConhecimento;
  //   method(data)
  //     .then((result) => {
  //       callGlobalNotify({ message: result.message, variant: 'success' })
  //       load(params.id)
  //     })
  //     .catch((error) => {
  //       callGlobalAlert(error)
  //       handleGlobalLoading.hide()
  //     })
  // }
  function removeConhecimento(index) {
    if (!formData.id) {
      setformData((prevState) => ({
        ...prevState,
        ['colaborador_conhecimento']: prevState['colaborador_conhecimento'].filter((r, i) => i !== index)
      }));
    } else {
      let cc = formData['colaborador_conhecimento'][index];
      callGlobalDialog({
        title: 'Excluir Conhecimento',
        subTitle: 'Tem certeza que deseja excluir esse conhecimento do colaborador?',
        color: 'red',
        labelSuccess: 'Excluir',
      })
        .then(() => {
          handleGlobalLoading.show()
          deleteColaboradorConhecimento(cc.id)
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
    setformData((prevState) => ({
      ...prevState,
      [propertyName]: newValue
    }));
  }
  function handleVinculoForm(propertyName, newValue) {
    setformData((prevState) => {
      console.log(prevState['vinculo'])
      return {
        ...prevState,
        ['vinculo']: { ...prevState['vinculo'], [propertyName]: newValue }
      }
    });
  };

  const handleSubmit = useCallback((event) => {
    validateSchema(colaboradorSchema, formData)
      .then(() => {
        setErrors(true)
        save()
      })
      .catch((errors) => {
        console.log(errors)
        setErrors(errors)
      })
    event.preventDefault();
    event.stopPropagation();
  }, [formData]);

  function beforeSave(form) {
    let data = structuredClone(form);
    data.thumbnail = ''
    data.cpf = data.cpf.replace(/\D/g, '')
    data = formatForm(data).rebaseIds(['setor']).getResult()
    data.vinculo = formatForm(data.vinculo).rebaseIds(['empresa', 'funcao']).getResult()
    if (!data.id) {
      data.colaborador_conhecimento = data.colaborador_conhecimento.map(c => {
        return {
          conhecimento_id: c.conhecimento.id,
          conhecimento_nivel_id: c.conhecimento_nivel.id,
        }
      })
    }
    return data;
  }

  function save() {
    let data = beforeSave(formData);
    handleGlobalLoading.show()
    let method = !data.id ? createColaborador : updateColaborador;
    method(data)
      .then((res) => {
        callGlobalNotify({ message: res.message, variant: 'success' })
        navigate('/colaboradores/editar/' + res.colaborador.id)
      })
      .catch((error) => {
        callGlobalAlert(error)
        handleGlobalLoading.hide()
      })
  }

  useEffect(() => {
    params.id && load(params.id)
  }, [params]);

  return (
    <Background>
      <HeaderTitle title="Colaborador" breadcrumbBlockeds={['editar']} />
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
                placeholder="Nome"
                value={formData.nome}
                onChange={({ target: { value } }) => handleForm('nome', value)}
                isInvalid={!!errors.nome} />
              <FeedbackError error={errors.nome} />
            </Col>
            <Col md={3} className="m-auto">
              <SelectAsync
                placeholder="Selecione um setor"
                loadOptions={listSetores}
                value={formData.setor}
                onChange={(setor) => handleForm('setor', setor)}
                isInvalid={!!errors.setor} />
              <FeedbackError error={errors.setor} />
            </Col>
            <Col md={'auto'} className="m-auto">
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Ativo"
                checked={formData.active}
                onChange={({ target: { value } }) => handleForm('active', !formData.active)}
              />
            </Col>
            <Col md={'auto'} className="m-auto">
              <Button type="submit">Salvar</Button>
            </Col>
          </Row>
        </Section>
        {showHistoryVinculo && (
          <Section>
            <h4>Histórico Vínculo</h4>
            <Row className="mt-3" >
            <Col md="auto">
                </Col>
              <Form.Group as={Col} md={2}>
                <Form.Label>Empresa</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md={2}>
                <Form.Label>Função</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md={2}>
                <Form.Label>Data de Início</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md={2}>
                <Form.Label>Data de Fim</Form.Label>
              </Form.Group>
              <Form.Group as={Col} md={1}>
                <Form.Label>Carga Horária</Form.Label>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  Dias da Semana
                </Form.Label>
              </Form.Group>
            </Row>
            {historyVinculo.map((vinculo) => (
              <Row className="mb-3" style={{ backgroundColor: 'var(--bs-gray)' }}>
                <Col md="auto">
                  <FaHistory />
                </Col>
                <Form.Group as={Col} md={2} className="px-1">
                  <span>{vinculo?.empresa.nome}</span>
                </Form.Group>
                <Form.Group as={Col} md={2} className="px-1">
                  <span>{vinculo?.funcao.nome}</span>
                </Form.Group>
                <Form.Group as={Col} md={2} className="px-1">
                  <span>{dateEnToPt(vinculo?.data_inicio)}</span>
                </Form.Group>
                <Form.Group as={Col} md={2} className="px-1">
                  <span>{dateEnToPt(vinculo?.data_fim)}</span>
                </Form.Group>
                <Form.Group as={Col} md={1} className="px-1">
                  <span>{vinculo?.carga_horaria}</span>
                </Form.Group>
                <Form.Group as={Col} className="px-1">
                  <div className="d-flex">
                    {Object.keys(weekdays).map((key, index) => vinculo[key] === 1 && (<span>{weekdays[key]},</span>))}
                  </div>
                </Form.Group>
              </Row>
            ))}
          </Section>
        )}
        <Section>
          <h4>Vínculo
            {formData.id && (
              <>
                <Button onClick={handleToggleHistoryVinculo}><FaHistory title="Histórico" /></Button>
              </>
            )}
          </h4>
          <Row className="mt-3">
            <Form.Group as={Col} md={2}>
            <Form.Label>Empresa</Form.Label>
              <SelectAsync
                placeholder="Empresa contratante"
                loadOptions={listEmpresas}
                value={formData.vinculo?.empresa}
                onChange={(empresa) => handleVinculoForm('empresa', empresa)}
                isInvalid={!!errors.vinculo?.empresa} />
              <FeedbackError error={errors.vinculo?.empresa} />
            </Form.Group>
            <Form.Group as={Col} md={2}>
            <Form.Label>Função</Form.Label>
              <SelectAsync
                placeholder="Função / Cargo"
                loadOptions={listFuncao}
                value={formData.vinculo?.funcao}
                onChange={(funcao) => handleVinculoForm('funcao', funcao)}
                isInvalid={!!errors.vinculo?.funcao} />
              <FeedbackError error={errors.vinculo?.funcao} />
            </Form.Group>
            <Form.Group as={Col} md={2}>
            <Form.Label>Data de Início</Form.Label>
              <DateInput
                value={formData.vinculo?.data_inicio}
                onChangeValid={date => handleVinculoForm('data_inicio', date)}
                isInvalid={!!errors.vinculo?.data_inicio} />
              <FeedbackError error={errors.vinculo?.data_inicio} />
            </Form.Group>
            <Form.Group as={Col} md={2}>
            <Form.Label>Data de Fim</Form.Label>
              <DateInput              
                value={formData.vinculo?.data_fim}
                onChangeValid={date => handleVinculoForm('data_fim', date)}
                isInvalid={!!errors.vinculo?.data_fim} />
              <FeedbackError error={errors.vinculo?.data_fim} />
            </Form.Group>
            <Form.Group as={Col} md={1}>
            <Form.Label>Carga Horária</Form.Label>
              <Form.Control
                value={formData.vinculo?.carga_horaria}
                type="number"
                onChange={({ target: { value } }) => handleVinculoForm('carga_horaria', value)}
                isInvalid={!!errors.vinculo?.carga_horaria} />
              <FeedbackError error={errors.vinculo?.carga_horaria} />
            </Form.Group>
            <Form.Group as={Col}>
            <Form.Label>
                Dias da Semana
              </Form.Label>
              <Col className="weekdays-checkbox">
                {Object.keys(weekdays).map((key, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    label={weekdays[key]}
                    checked={formData?.vinculo?.[key]}
                    onChange={({ target: { checked } }) => handleVinculoForm(key, checked)}
                    inline
                  />
                ))}
              </Col>
            </Form.Group>
          </Row>
          {formData.id && showBtnNewVinculo && (
            <Row className="justify-content-center mt-4 mb-4">
              <BtnSimple Icon={FaPlus} onClick={() => newVinculo()}>Novo Vínculo</BtnSimple>
            </Row>
          )}
        </Section>
        <Row className="justify-content-center mt-4 mb-4">
          <BtnSimple Icon={FaBrain} onClick={() => handleConhecimento()}>Adicionar Conhecimento</BtnSimple>
        </Row>
        {/* <Stack direction="horizontal" className="mx-auto justify-content-center mb-3" gap={formData.colaborador_conhecimento.length}> */}
        <HorizontalScrollview className="" style={{flexWrap: 'wrap', gap: '0.6em'}}>
          <>
            {formData.colaborador_conhecimento.map((resp, i) => (
              <CardConhecimento
                key={i}
                title={resp.conhecimento.nome}
                titleColor={resp.conhecimento.color}
                nivelColor={resp.conhecimento_nivel?.color}
                nivel={resp.conhecimento_nivel?.grau}
                onEdit={() => handleConhecimento(resp, i)}
                onRemove={() => removeConhecimento(i)} />
            ))}
          </>
        </HorizontalScrollview>
        <Row>

          <Col md={3}>
            <Section>
              <h4>Contato</h4>
              <Form.Group as={Row} className="mt-4 mb-4">
                <Form.Control
                  placeholder="Telefone"
                  as={ReactInputMask}
                  maskChar={null}
                  mask={'(99)99999-9999'}
                  value={formData.telefone}
                  onChange={({ target: { value } }) => handleForm('telefone', value)}
                  isInvalid={!!errors.telefone} />
                <FeedbackError error={errors.telefone} />
              </Form.Group>
              <Form.Group as={Row} className="mb-4">
                <Form.Control
                  placeholder="Email"
                  value={formData.email}
                  onChange={({ target: { value } }) => handleForm('email', value)}
                  isInvalid={!!errors.email} />
                <FeedbackError error={errors.email} />
              </Form.Group>
            </Section>
          </Col>
          <Col md={3}>
            <Section>
              <h4>Informações</h4>
              <Form.Group className="mt-4 mb-4">
                <Form.Control
                  placeholder="PR"
                  value={formData.pr}
                  onChange={({ target: { value } }) => handleForm('pr', value)}
                  isInvalid={!!errors.pr} />
                <FeedbackError error={errors.pr} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Control
                  placeholder="CPF"
                  as={ReactInputMask}
                  maskChar={null}
                  mask={'999.999.999-99'}
                  value={formData.cpf}
                  disabled={formData.id}
                  title={formData.id ? "Não é possivel editar cpf de um colaborador, em caso de necessidade crítica favor contactar o desenvolvimento" : null}
                  aria-disabled
                  onChange={({ target: { value } }) => handleForm('cpf', value)}
                  isInvalid={!!errors.cpf} />
                <FeedbackError error={errors.cpf} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Data de nascimento</Form.Label>
                <DateInput
                  placeholder={'Data de Nascimento'}
                  value={formData.nascimento}
                  onChangeValid={date => handleForm('nascimento', date)}
                  isInvalid={!!errors.nascimento} />
                <FeedbackError error={errors.nascimento} />
              </Form.Group>
            </Section>
          </Col>
          <Col md={3}>
            <Section>
              <h4>Usuário</h4>
              <Form.Group className="mt-4 mb-4">
                <Form.Label>Habilitar usuário para logar no SGP?</Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label=""
                  checked={formData.user_active}
                  onChange={({ target: { value } }) => handleForm('user_active', !formData.user_active)}
                />
                <FeedbackError error={errors.user_active} />
              </Form.Group>
            </Section>
          </Col>
          <Col md={6} className="">

          </Col>

        </Row>
      </Form>
      <CanvasConhecimento ref={canvasConhecimentoRef} onSave={saveConhecimento} />
    </Background >
  );
}
