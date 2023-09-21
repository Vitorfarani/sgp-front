import { Background, BadgeColor, BtnSimple, ClipboardContainer, ConhecimentoBadge, CustomOffCanvas, DateInput, DatePicker, FeedbackError, HeaderTitle, InfoDropdown, KanbanBoard, ModalTarefa, Section, SelectAsync, Table, TextareaEditor, ThumbnailUploader } from "@/components/index";
import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion, Badge, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import HorizontalScrollView from "@/components/HorizontalScrollView";
import { useNavigate, useParams } from "react-router-dom";
import CardResponsavel from "./components/CardResponsavel";
import './style.scss'
import { useTheme } from "@/utils/context/ThemeProvider";
import { pessoaNomeAbreviadoMask } from "@/utils/helpers/mask";
import CardSetor from "./components/CardSetor";
import Tabs from "./components/Tabs";
import { ProjetoProvider, useProjetoContext } from "./projetoContext";
import { deleteTarefa, listTarefas, updateTarefaPositionFromKanban, updateTarefa } from "@/services/tarefa/tarefas";

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
  repositorio: '',
  contato_nome: '',
  contato_email: '',
  contato_telefone: '',
  hml_ip: '',
  hml_banco: '',
  prd_ip: '',
  prd_banco: '',
}
const MOCK_tarefa = {
  id: null,
  projeto_id: null,
  tarefa_base: null,
  tarefa_status: null,
  tarefa_colaborador: [],
  tarefa_conhecimento: [],
  nome: '',
  descricao: '',
  // dificuldade: 0,
  observacoes: [],
  checklist: null,
  // coeficiente: 0,
  data_inicio_programado: null,
  data_fim_programado: null,
  data_inicio_real: null,
  data_fim_real: null,
  interrompido_at: null,
  interrompido_motivo: null,
  // order: null,
  active: true
}
function Projeto() {
  let params = useParams();
  const [tarefaLoading, setTarefaLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {projeto, load} = useProjetoContext();
  const navigate = useNavigate();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const kanban = useRef(null);
  const modalTarefa = useRef(null);
  const projetoRef = useRef(projeto);

  useEffect(() => {
    if(params.id){
      load(params.id)
      .then(({tarefaStatusResult,tarefasResult}) => {
        kanban.current.handleColumns(tarefaStatusResult)
        kanban.current.handleTasks(tarefasResult)
      })
    } 
  }, []);

  function removeTarefa(tarefa) {
      handleGlobalLoading.show()
      deleteTarefa(tarefa.id)
        .then((result) => {
          callGlobalNotify({ message: result.message, variant: 'danger' })
          loadTarefas()
        })
        .catch((error) => {
          callGlobalAlert(error)
          handleGlobalLoading.hide()
        })
  }
  function loadTarefas() {
    setTarefaLoading(true)
    listTarefas('?projeto='+params.id)
    .then((result) => {
      kanban.current.handleTasks(result)
    })
    .catch(callGlobalAlert)
    .finally(() => setTarefaLoading(false))
  }

  function updatePositionTasks(task) {
    let data = {
      tarefa_status_id: task.tarefa_status_id,
      projeto_id: projeto.id,
      order: task.order,
      nome: task.nome,
    }
    console.log(task.order)
    updateTarefaPositionFromKanban(task.id, data)
    .then((result) => {
      loadTarefas()
    })
    .catch((error) => {
      if(error.code === 429){
        loadTarefas()
      }
      callGlobalAlert(error)
    })
  }

  useEffect(() => {
    const loopLoadtarefa = setInterval(() => {
      loadTarefas();
    }, 12000);
    return () => clearInterval(loopLoadtarefa);
  }, []);

  return (
    <Background>
      <HeaderTitle title="Projeto" breadcrumbBlockeds={['editar']} />
      {!!projeto && (
        <>
          <Section className={'slim'} eventKey="0" >
            <Row>
              <Col md={'auto'}>
                <ThumbnailUploader
                  size={60}
                  readonly
                  url={projeto.thumbnail}
                  placeholder={projeto.nome}
                />
              </Col>
              <Col className="m-auto">
                <h2>{projeto.nome}</h2>
                <p style={{ fontSize: '0.9em', marginTop: 10 }}>{projeto.descricao}</p>
              </Col>
              <Col md={'auto'} className="m-auto">
                <InfoDropdown data={projeto} align="start" />
              </Col>
              <Col md={3} className="m-auto">
                <span>Cliente</span>
                <h4>{projeto.cliente.nome}</h4>
              </Col>
              <Col md={'auto'} className="m-auto">
                <Button className={Object.keys(errors) > 0 ? "border border-danger" : ""} type="button" onClick={() => navigate('/projetos/editar/' + projeto.id)}>Editar</Button>
              </Col>
            </Row>
          </Section>
          <Row>
            <Col>
              <Section>
                <h5>Conhecimentos envolvidos</h5>
                <Row>
                  {projeto.projeto_conhecimento.map((pc, i) => (
                    <div key={i} className="mb-2 w-auto">
                      <ConhecimentoBadge conhecimento={pc.conhecimento} />
                    </div>
                  ))}
                </Row>
              </Section>
            </Col>
            {(!!projeto.hml_ip || !!projeto.hml_banco) && (
              <Col xs={12} md={3}>
                <Section>
                  <h5>Ambiente Homologação</h5>
                  <Row>
                    <ClipboardContainer>{projeto.hml_ip}</ClipboardContainer>
                  </Row>
                  <Row>
                    <ClipboardContainer>{projeto.hml_banco}</ClipboardContainer>
                  </Row>
                </Section>
              </Col>
            )}
            {(!!projeto.prd_ip || !!projeto.prd_banco) && (
              <Col xs={12} md={3}>
                <Section>
                  <h5>Ambiente Produção</h5>
                  <Row>
                    <ClipboardContainer>{projeto.prd_ip}</ClipboardContainer>
                  </Row>
                  <Row>
                    <ClipboardContainer>{projeto.prd_banco}</ClipboardContainer>
                  </Row>
                </Section>
              </Col>
            )}
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <Section>
                <h5>Setores</h5>
                <HorizontalScrollView className="mb-3" style={projeto.projeto_setor.length <= 1 ? { justifyContent: 'center' } : { justifyContent: 'flex-start' }}>
                  {projeto.projeto_setor.map((setor, i) => (
                    <CardSetor
                      key={i}
                      title={setor.setor.sigla}
                      dataInicio={setor.inicio}
                      dataFim={setor.fim}
                      isMain={setor.principal} />
                  ))}
                </HorizontalScrollView>
              </Section>
              <Section>
                <h5>Responsáveis</h5>
                <HorizontalScrollView className="mb-3" style={projeto.projeto_responsavel.length <= 1 ? { justifyContent: 'center' } : { justifyContent: 'flex-start' }}>
                  {projeto.projeto_responsavel.map((resp, i) => (
                    <CardResponsavel
                      key={i}
                      onOpen={() => window.open('/colaboradores/visualizar/' + resp.responsavel.id, "_blank", "noreferrer noopener")}
                      title={pessoaNomeAbreviadoMask(resp.responsavel.nome)}
                      thumbnail={resp.responsavel.user?.thumbnail}
                      subtitle={resp.responsavel.setor?.nome}
                      dataInicio={resp.inicio}
                      dataFim={resp.fim} />
                  ))}
                </HorizontalScrollView>
              </Section>
              <Section >
                <Row className="mb-3">
                  <Col md={3} className=""><strong>Fase</strong></Col>
                  <Col><h5>{projeto.projeto_fase.nome}</h5></Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3} className=""><strong>Status</strong></Col>
                  <Col><h6>{projeto.projeto_status.nome}</h6></Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3} className=""><strong>SEI</strong></Col>
                  <Col><ClipboardContainer>{projeto.sei}</ClipboardContainer></Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3} className=""><strong>Repositório</strong></Col>
                  <Col><ClipboardContainer>{projeto.repositorio}</ClipboardContainer></Col>
                </Row>
                <Accordion flush>
                  <Accordion.Item eventKey="0" >
                    <Accordion.Header>Contato</Accordion.Header>
                    <Accordion.Body>
                      <Row className="mb-1">
                        <Col md={3} className=""><strong>Contato Nome</strong></Col>
                        <Col><span>{projeto.contato_nome}</span></Col>
                      </Row>
                      <Row className="mb-1">
                        <Col md={3} className=""><strong>Contato Email</strong></Col>
                        <Col><ClipboardContainer>{projeto.contato_email}</ClipboardContainer></Col>
                      </Row>
                      <Row className="mb-1">
                        <Col md={3} className=""><strong>Contato Telefone</strong></Col>
                        <Col><ClipboardContainer>{projeto.contato_telefone}</ClipboardContainer></Col>
                      </Row>

                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Section>
            </Col>
            <Col xs={12} md={8}>
              <Tabs />
            </Col>
            {/* <Col xs={12} md={4}>
          <Section>
            <h5>Responsáveis</h5>
            <HorizontalScrollView className="mb-3" style={projeto.projeto_responsavel.length <= 1 ? { justifyContent: 'center' } : { justifyContent: 'flex-start' }}>
              {projeto.projeto_responsavel.map((resp, i) => (
                <CardResponsavel
                  key={i}
                  onOpen={() => window.open('/colaboradores/visualizar/' + resp.responsavel.id, "_blank", "noreferrer noopener")}
                  title={pessoaNomeAbreviadoMask(resp.responsavel.nome)}
                  subtitle={resp.responsavel.setor.nome}
                  dataInicio={resp.inicio}
                  dataFim={resp.fim} />
              ))}
            </HorizontalScrollView>
          </Section>
        </Col> */}
          </Row>
      <Row className="d-flex justify-content-center mb-3">
        <h1 className="w-auto">Tarefas {tarefaLoading && <Spinner style={{fontSize: '0.59rem'}}/>}</h1>
      </Row>
        </>
      )}
      <KanbanBoard
        ref={kanban}
        onChangeTask={(task) => updatePositionTasks(task)}
        onAddClick={(tarefa_status) => modalTarefa.current.show({ ...MOCK_tarefa, tarefa_status, projeto_id: projeto.id })}
        onEditClick={(row) => modalTarefa.current.show(row)}
        fieldColumnPivot="id"
        fieldTaskPivot="tarefa_status_id" />
      <ModalTarefa ref={modalTarefa} onHide={() => {}} onDelete={removeTarefa} onSuccess={loadTarefas}/>
    </Background>
  );
}

export default () => (
  <ProjetoProvider>
    <Projeto/>
  </ProjetoProvider>
) 