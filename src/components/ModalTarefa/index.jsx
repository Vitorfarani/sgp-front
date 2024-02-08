import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { BadgeColor, BtnSimple, DateInput, FeedbackError, HorizontalScrollview, InfoDropdown, Observacoes, Section, SelectAsync, TextareaEditor, TextareaHided } from '..';
import { validateSchema } from '@/utils/helpers/yup';
import { tarefaSchema } from './validation';
import { interrupcaoSchema } from './validation';
import { FiPlus } from 'react-icons/fi';
import { FaAlignLeft, FaBrain, FaCheckSquare, FaComment, FaTasks, FaTextWidth, FaTicketAlt } from 'react-icons/fa';
import SideButtons from './SideButtons';
import { useProjetoContext } from '@/screens/Projetos/ProjetoContext';
import ColaboradoresSelecteds from './ColaboradoresSelecteds';
import { createTarefaColaborador, deleteTarefaColaborador, updateTarefaColaborador } from '@/services/tarefa/tarefaColaborador';
import { useTheme } from '@/utils/context/ThemeProvider';
import { listTarefaBase } from '@/services/tarefa/tarefaBase';
import { dateDiffWithLabels, diffDatetimes, diffDatetimesHumanized } from '@/utils/helpers/date';
import Checklist from '../Checklist';
import { useAuth } from '@/utils/context/AuthProvider';
import { formatForm } from '@/utils/helpers/forms';
import { listConhecimentos } from '@/services/conhecimento/conhecimentos';
import { createTarefaConhecimento, deleteTarefaConhecimento } from '@/services/tarefa/tarefaConhecimento';
import { createTarefa, deleteTarefa, interromperTarefa, restoreTarefa, showTarefa, updateTarefa } from '@/services/tarefa/tarefas';
import { createTarefaObservacao, deleteTarefaObservacao } from '@/services/tarefa/tarefaObservacao';


const ModalTarefa = forwardRef(({
  onSuccess,
  onDelete,
  onCancel,
  onHide,
  ...props
}, ref) => {
  const modal = useRef()
  const checklistRef = useRef()
  const { user } = useAuth();

  const { projeto } = useProjetoContext();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [errors, setErrors] = useState({});
  const [observacao, setObservacao] = useState();
  const [anexos, setAnexos] = useState([]);
  const [showtextareaObs, setshowtextareaObs] = useState(false);
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const [haveUpdate, sethaveUpdate] = useState(false);
  const prazoLabels = useMemo(() => {
    return dateDiffWithLabels(formData.data_fim_programado, formData.data_fim_real)
  }, [formData.data_fim_programado, formData.data_fim_real]);

  const diffProgramado = useMemo(() => {
    if (!formData.data_inicio_programado || !formData.data_fim_programado) return '';
    return diffDatetimesHumanized(formData.data_inicio_programado, formData.data_fim_programado)
  }, [formData.data_inicio_programado, formData.data_fim_programado]);

  const diffReal = useMemo(() => {
    if (!formData.data_inicio_real || !formData.data_fim_real) return '';
    return diffDatetimesHumanized(formData.data_inicio_real, formData.data_fim_real)
  }, [formData.data_inicio_real, formData.data_fim_real]);

  useEffect(() => {
    if (!isShow) {
      hide()
    }
  }, [isShow]);

  function hide() {
    setIsShow(false)
    setErrors(false)
    setValidated(false);
    setshowtextareaObs(false)
    setTimeout(() => {
      setFormData({})
      sethaveUpdate(false)
    }, 200);
    onHide(haveUpdate)
  }

  function show(data) {
    setIsShow(true)
    if (!data.id) {
      console.log(data)
      setFormData(data)
    } else {
      load(data.id)
    }
  }
  function beforeEdit(results) {
    checklistRef.current.init(results.checklist)

    results['tarefa_conhecimento'] = results['tarefa_conhecimento'].map(tc => ({
      ...tc.conhecimento,
      tarefa_conhecimento_id: tc.id
    }))
    return results
  }
  const load = async (id) => {
    setErrors({})
    handleGlobalLoading.show()
    showTarefa(id)
      .then((results) => {
        setFormData(beforeEdit(results))
        setObservacao()
      })
      .catch(callGlobalAlert)
      .finally(handleGlobalLoading.hide)
  }
  useImperativeHandle(ref, () => ({
    show,
    isShow,
    hide
  }));

  function handleForm(propertyName, newValue) {
    setFormData((prevState) => ({
      ...prevState,
      [propertyName]: newValue
    }));
  };


  function addTarefaColaborador(colaborador) {
    console.log(colaborador)
    if (!formData.id) {
      setFormData((prevState) => ({
        ...prevState,
        ['tarefa_colaborador']: [...prevState['tarefa_colaborador'], { colaborador_id: colaborador.id, colaborador }]
      }));

    } else {
      let data = {
        tarefa_id: formData.id,
        colaborador_id: colaborador.id,
      }
      handleGlobalLoading.show();
      createTarefaColaborador(data)
        .then((result) => {
          callGlobalNotify({ message: result.message, variant: 'success' })
          setFormData((prevState) => ({
            ...prevState,
            ['tarefa_colaborador']: [...prevState.tarefa_colaborador, result.tarefa_colaborador]
          }));
          sethaveUpdate(true)

          // load(formData.id)
          handleGlobalLoading.hide()
        })
        .catch((error) => {
          callGlobalAlert(error)
          handleGlobalLoading.hide()
        })
    }
  }

  function removeTarefaColaborador(tarefa_colaborador) {
    if (!formData.id) {
      setFormData((prevState) => ({
        ...prevState,
        ['tarefa_colaborador']: prevState['tarefa_colaborador'].filter((tc, i) => tc.colaborador_id !== tarefa_colaborador.colaborador_id)
      }));
    } else {
      callGlobalDialog({
        title: 'Excluir Colaborador',
        subTitle: 'Tem certeza que deseja excluir esse colaborador da tarefa?',
        color: 'red',
        labelSuccess: 'Excluir',
      })
        .then(() => {
          handleGlobalLoading.show()
          deleteTarefaColaborador(tarefa_colaborador.id)
            .then((result) => {
              callGlobalNotify({ message: result.message, variant: 'danger' })
              setFormData((prevState) => ({
                ...prevState,
                ['tarefa_colaborador']: prevState['tarefa_colaborador'].filter((tc, i) => tc.id !== tarefa_colaborador.id)
              }));
              sethaveUpdate(true)
            })
            .catch((error) => {
              callGlobalAlert(error)
            })
            .finally(handleGlobalLoading.hide)
        })
    }
  }
  function enabledChecklist() {
    handleForm('checklist', [])
    checklistRef.current.init([])
  }

  function addObservacao() {
    let data = {
      colaborador: user.colaborador,
      colaborador_id: user.colaborador.id,
      conteudo: observacao,
      anexos: []
    };

    if (!formData.id) {
      let updatedObs = structuredClone([...formData.tarefa_observacao])
      updatedObs.push(data)
      handleForm('tarefa_observacao', updatedObs)
    } else {
      data.tarefa_id = formData.id;

      handleGlobalLoading.show()
      createTarefaObservacao(data)
        .then((result) => {
          callGlobalNotify({ message: result.message, variant: 'success' })
          let updatedObs = [...formData.tarefa_observacao]
          updatedObs.push(result.tarefa_observacao)
          handleForm('tarefa_observacao', updatedObs)
          setObservacao()
          handleGlobalLoading.hide()
        })
        .catch((error) => {
          callGlobalAlert(error)
          handleGlobalLoading.hide()
        })
    }

  }

  function removeObservacao(id) {
    if (!formData.id) {
      setFormData((prevState) => ({
        ...prevState,
        ['tarefa_observacao']: prevState['tarefa_observacao'].filter((o, i) => o.id !== id)
      }));
    } else {
      callGlobalDialog({
        title: 'Excluir Observação',
        subTitle: 'Tem certeza que deseja excluir essa observação da tarefa?',
        color: 'red',
        labelSuccess: 'Excluir',
      })
        .then(() => {
          handleGlobalLoading.show()
          deleteTarefaObservacao(id)
            .then((result) => {
              callGlobalNotify({ message: result.message, variant: 'danger' })
              setFormData((prevState) => ({
                ...prevState,
                ['tarefa_observacao']: prevState['tarefa_observacao'].filter((o, i) => o.id !== id)
              }));
            })
          handleGlobalLoading.hide()
            .catch((error) => {
              callGlobalAlert(error)
              handleGlobalLoading.hide()
            })
        })
    }
  }

  function handleFilesChange(event) {
    const files = Array.from(event.target.files).slice(0, 6);
    const updatedFiles = files.map(file => ({
      name: file.name,
      type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' :
        file.type.startsWith('image') ? 'image' : 'file',
      uri: URL.createObjectURL(file),
      file
    }));
    let prev = [...anexos]
    prev.push(updatedFiles)
    setAnexos(prev)
  }

  function removeFile(index) {
    setAnexos(anexos.filter((_, i) => index !== i))
  }
  function addFiles() {
    document.getElementById('file-input').click()
  }
  function handleConhecimento(data, option) {
    if (!formData.id) {
      handleForm('tarefa_conhecimento', data)
    } else {
      option.tarefa_id = formData.id;
      option.conhecimento_id = option.id;
      handleGlobalLoading.show()
      createTarefaConhecimento(option)
        .then((result) => {
          handleForm('tarefa_conhecimento', data)
          // callGlobalNotify({ message: result.message, variant: 'success' })
          // load(params.id)
        })
        .catch(callGlobalAlert)
        .finally(handleGlobalLoading.hide)
    }

  }

  function removeConhecimento(data, removedValue) {
    if (!formData.id) {
      handleForm('tarefa_conhecimento', data)
    } else {
      callGlobalDialog({
        title: 'Excluir o Conhecimento',
        subTitle: 'Tem certeza que deseja excluir esse conhecimento do projeto?',
        color: 'red',
        labelSuccess: 'Excluir',
      })
        .then(() => {
          handleGlobalLoading.show()
          deleteTarefaConhecimento(removedValue.tarefa_conhecimento_id)
            .then((result) => {
              handleForm('tarefa_conhecimento', data)
              // callGlobalNotify({ message: result.message, variant: 'danger' })
            })
            .catch(callGlobalAlert)
            .finally(handleGlobalLoading.hide)
        })
    }
  }

  function onInterruption(data) {

    validateSchema(interrupcaoSchema, data).then(() => {

      callGlobalDialog({
        title: 'Interomper tarefa',
        subTitle: 'Tem certeza que deseja interromper esse tarefa?',
        color: 'red',
        labelSuccess: 'Sim',
      })
        .then(() => {
          handleGlobalLoading.show()
          interromperTarefa({ id: formData.id, deleted_at: data.interrompido_at, ...data })
            .then((result) => {
              sethaveUpdate(true)
              hide()
            })
            .catch(callGlobalAlert)
            .finally(handleGlobalLoading.hide)
        })
    })
      .catch((errors) => {
        callGlobalDialog({
          title: 'Erro ao interromper',
          subTitle: errors.interrompido_at,
          color: 'orange',
          labelSuccess: 'Ok',
        })
      })

  }
  function onRestore(data) {
    callGlobalDialog({
      title: 'Restaurar tarefa',
      subTitle: 'Tem certeza que deseja restaurar esse tarefa?',
      color: 'green',
      labelSuccess: 'Sim',
    })
      .then(() => {
        handleGlobalLoading.show()
        restoreTarefa(formData.id)
          .then((result) => {
            sethaveUpdate(true)
            load(formData.id)
          })
          .catch(callGlobalAlert)
          .finally(handleGlobalLoading.hide)
      })
  }

  function beforeSave(form) {
    try {

      let data = structuredClone(form);
      data = formatForm(data).rebaseIds(['tarefa_status', 'tarefa_base']).trimTextInputs().getResult()
      data.tarefa_conhecimento = data.tarefa_conhecimento.map(c => {
        return {
          ...c,
          conhecimento_id: c.id,
        }
      })
      if (!data.id) {
        data.tarefa_colaborador = data.tarefa_colaborador.map(r => {
          return {
            ...r,
            colaborador_id: r.colaborador.id,
          }
        })
      }
      return data;

    } catch (error) {
      callGlobalAlert({ title: 'Houve um erro no processamento do formulário', message: error.message, color: 'var(--bs-danger)' })
      return false
    }

  }
  function save() {
    let data = beforeSave(formData)
    console.log(data)
    if (!data) return
    handleGlobalLoading.show()
    let method = !data.id ? createTarefa : updateTarefa;
    method(data)
      .then((res) => {
        callGlobalNotify({ message: res.message, variant: 'success' })
        load(res.tarefa.id)
        handleGlobalLoading.hide()
        sethaveUpdate(true)

      })
      .catch((error) => {
        callGlobalAlert(error)
        handleGlobalLoading.hide()
      })
  }
  function onSubmited(event) {
    console.table(formData)
    if (formData.data_fim_programado == '') {
      formData.data_fim_programado = null
    }
    if (formData.data_fim_real == '') {
      formData.data_fim_real = null
    }
    if (formData.data_inicio_real == '') {
      formData.data_inicio_real = null
    }
    if (formData.data_inicio_programado == '') {
      formData.data_inicio_programado = null
    }
    validateSchema(tarefaSchema, formData)
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
  }

  if (!projeto) return null
  // if (!Object.keys(formData).length) return null
  return (
    <Modal
      ref={modal}
      show={isShow}
      autoFocus
      onHide={() => hide()}
      backdrop={!formData.id ? 'static' : null}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: 0, paddingLeft: 30 }}>
        <Form.Group as={Col}>
          <TextareaHided
            placeholder="Nome da Tarefa *"
            value={formData.nome}
            autoFocus
            cols={0}
            maxLength={1000}
            onChange={({ target: { value } }) => handleForm('nome', value)}
            isInvalid={!!errors.nome} />
          <FeedbackError error={errors.nome} />
        </Form.Group>
      </Modal.Header>
      <Modal.Body>
        <Form id="formModalDialog" autoComplete="off" noValidate validated={validated} onSubmit={onSubmited} style={{ marginTop: 20 }}>
          <Container as={Row}>
            <Col xs={12} md={9} className='pr-3'>
              <Row className='mb-3'>
                <Col md={4}>
                  <ColaboradoresSelecteds title={"Executores"} tarefa={formData} onRemove={removeTarefaColaborador} />
                </Col>
                <Col className='mt-auto'>
                  {prazoLabels && (
                    <>
                      <BadgeColor color={prazoLabels.color}>{prazoLabels.label}</BadgeColor>
                      <span style={{ marginLeft: 12 }}>{prazoLabels.diff}</span>
                    </>
                  )}
                </Col>
                <Col></Col>
              </Row>
              <h5><FaAlignLeft style={{ marginRight: 10 }} />Descrição</h5>
              <Form.Group as={Col} style={{ marginLeft: 30, marginBottom: 30 }}>
                <Form.Control
                  value={formData.descricao}
                  rows={3}
                  as={'textarea'}
                  maxLength={3000}
                  onChange={({ target: { value } }) => handleForm('descricao', value)}
                  isInvalid={!!errors.descricao} />
                <FeedbackError error={errors.descricao} />
              </Form.Group>
              <h5><FaBrain style={{ marginRight: 10 }} />Conhecimentos</h5>
              <Row style={{ marginLeft: 30, marginBottom: 30 }}>
                <SelectAsync
                  isMulti
                  required
                  placeholder="Selecione os Conhecimentos necessários para essa tarefa"
                  loadOptions={(search) => listConhecimentos('?search=' + search)}
                  value={formData.tarefa_conhecimento}
                  onChange={(tarefa_conhecimento, action) => {
                    if (action.action === 'select-option') {
                      handleConhecimento(tarefa_conhecimento, action.option)
                    } else if (action.action === 'remove-value') {
                      removeConhecimento(tarefa_conhecimento, action.removedValue)
                    }
                  }}
                  isInvalid={!!errors.tarefa_conhecimento} />
                <FeedbackError error={errors.tarefa_conhecimento} />
              </Row>
              <Checklist ref={checklistRef} handleForm={handleForm} />
              {!!user.colaborador && (
                <h5><FaTasks style={{ marginRight: 10 }} />Atividades</h5>
              )}
              <Observacoes
                observacoes={formData.tarefa_observacao}
                isLoading={false}
                onRemove={(id) => removeObservacao(id)} />
              {!!user.colaborador && (
                <Section>
                  <Form.Group className="mb-4 ">
                    <Form.Label>Escrever um comentário</Form.Label>
                    <TextareaEditor
                      value={observacao}
                      bounds={1}
                      onChange={(value) => setObservacao(value)} />
                  </Form.Group>
                  {/* <Row className="m-auto justify-content-center">
                    <BtnSimple Icon={FiPlus} onClick={addFiles}>Anexar arquivos</BtnSimple>
                    <span style={{ display: 'contents' }}>{"(máximo de 6 arquivos)"}</span>
                  </Row>
                  {anexos.length > 0 && (
                    <HorizontalScrollview style={{ justifyContent: 'start' }}>
                      <>
                        {anexos.map((anexo, index) => (
                          <AnexoItem
                            key={index}
                            title={anexo.name}
                            type={anexo.type}
                            url={anexo.uri}
                            onRemove={() => removeFile(index)}
                          />
                        ))}
                      </>
                    </HorizontalScrollview>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFilesChange}
                  /> */}
                  <div className='flex-row-reverse d-grid  mt-3'>
                    <Button onClick={addObservacao}>Adicionar Atividade</Button>
                  </div>
                </Section>
              )}
            </Col>
            <Col xs={12} md={3}>
              <Form.Group className='mb-4'>
                <Form.Label>Base</Form.Label>
                <SelectAsync
                  placeholder=""
                  loadOptions={(search) => listTarefaBase(`?search=${search}`)}
                  value={formData.tarefa_base}
                  isInvalid={!!errors.tarefa_base}
                  onChange={(tarefa_base) => handleForm('tarefa_base', tarefa_base)} />
              </Form.Group>
              <Form.Group className='mb-4'>
                <Form.Label>Inicio estimado</Form.Label>
                <DateInput
                  type={"datetime-local"}
                  value={formData.data_inicio_programado}
                  onChangeValid={date => handleForm('data_inicio_programado', date)} />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Fim Estimado  {diffProgramado && <strong className='diffPrazos'>Prazo de {diffProgramado}</strong>}</Form.Label>
                <DateInput
                  type={"datetime-local"}
                  value={formData.data_fim_programado}
                  isInvalid={!!errors.data_fim_programado}
                  onChangeValid={date => handleForm('data_fim_programado', date)} />
                <FeedbackError error={errors.data_fim_programado} />
              </Form.Group>
              <SideButtons
                tarefa={formData}
                onCreateChecklist={() => enabledChecklist()}
                onInterruption={onInterruption}
                onRestore={onRestore}
                onStart={() => handleForm('data_inicio_real', new Date().toISOString().slice(0, 16))}
                onEnd={() => handleForm('data_fim_real', new Date().toISOString().slice(0, 16))}
                addTarefaColaborador={addTarefaColaborador} />
              <Form.Group className='mb-4 mt-4'>
                <Form.Label>Iniciado em</Form.Label>
                <DateInput
                  type={"datetime-local"}
                  value={formData.data_inicio_real}
                  onChangeValid={date => handleForm('data_inicio_real', date)} />
              </Form.Group>
              <Form.Group className='mb-4'>
                <Form.Label>Finalizado em <strong className='diffPrazos'> {diffReal}</strong></Form.Label>
                <DateInput
                  type={"datetime-local"}
                  value={formData.data_fim_real}
                  isInvalid={!!errors.data_fim_real}
                  onChangeValid={date => handleForm('data_fim_real', date)} />
                <FeedbackError error={errors.data_fim_real} />
              </Form.Group>

            </Col>

          </Container>
          <Button style={{ display: 'none' }} type='submit' id="btn-submit-hided" />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Col md={"auto"} className="d-flex align-items-center" style={{ marginRight: 'auto' }}>
          <Button variant="default" style={{ marginRight: 'auto' }} type="button" onClick={hide}>
            Fechar
          </Button>
          {!!formData.id && <InfoDropdown style={{ marginRight: 'auto' }} data={formData} />}
        </Col>
        <Button variant="secondary" type="button" className='w-25' onClick={() => document.getElementById('btn-submit-hided').click()}>
          {isLoading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
})
export default ModalTarefa;

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

