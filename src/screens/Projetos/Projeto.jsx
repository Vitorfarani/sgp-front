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
import { buildQueryString } from "@/utils/helpers/format";
import { useDebounce } from "use-debounce";
import { listProjetoResponsavel } from "@/services/projeto/projetoResponsavel";
import useQueryParams from "@/utils/hooks/useQueryParams";


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
  tarefa_observacao: [],
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

const baseTarefafilters = {
  search: '',
  deleted: false,
  colaborador: null,
};

function Projeto() {
  let params = useParams();
  const [tarefaLoading, setTarefaLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { projeto, load } = useProjetoContext();
  const navigate = useNavigate();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const kanban = useRef(null);
  const modalTarefa = useRef(null);
  const projetoRef = useRef(projeto);
  const [filtersState, setFiltersState] = useState({ projeto: params.id, ...baseTarefafilters });
  const [debouncedFilters] = useDebounce(filtersState, 200);
  const queryParams = useQueryParams();
  const handleChangeFilters = useCallback((name, value) => {
    setFiltersState((prevFiltersState) => {
      return {
        ...prevFiltersState,
        [name]: value,
      };
    });
  }, []);

  useEffect(() => {
   
    if (params.id) {
      load(params.id)
        .then(({ tarefaStatusResult, tarefasResult }) => {
          kanban.current.handleColumns(tarefaStatusResult)
          kanban.current.handleTasks(tarefasResult)
          if(queryParams.has('tarefa')) {
            let finded = tarefasResult.find(e => e.id == queryParams.get('tarefa'))
            if(finded) {
              modalTarefa.current.show(finded)
            } else {
            callGlobalNotify({ message: 'Tarefa não encontrada', variant: 'danger' })

            }
          }
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
  function loadTarefas(forceReLoad = false) {
    if (modalTarefa.current.isShow && !forceReLoad) return
    setTarefaLoading(true)
    listTarefas(buildQueryString({...filtersState, colaborador: filtersState.colaborador?.colaborador_id}))
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
    
    updateTarefaPositionFromKanban(task.id, data)
      .then((result) => {
        loadTarefas()
      })
      .catch((error) => {
        if (error.code === 429) {
          loadTarefas()
        }
        callGlobalAlert(error)
      })
  }

  useEffect(() => {
    const loopLoadtarefa = setInterval(() => {
      // loadTarefas();
    }, 12000);
    return () => clearInterval(loopLoadtarefa);
  }, []);

  useEffect(() => {
    if (!!projeto) {
      loadTarefas()
    }
  }, [debouncedFilters]);
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
                  file={projeto.thumbnail}
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
                <span>{projeto.cliente.setor}</span>
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
                      historico={setor.historico}
                      dataFim={setor.fim}
                      isMain={setor.principal} />
                  ))}
                </HorizontalScrollView>
              </Section>
              <Section>
                <h5>Envolvidos</h5>
                <HorizontalScrollView className="mb-3" style={projeto.projeto_responsavel.length <= 1 ? { justifyContent: 'center' } : { justifyContent: 'flex-start' }}>
                  {projeto.projeto_responsavel.map((resp, i) => (
                    <CardResponsavel
                      key={i}
                      onOpen={() => window.open('/colaboradores/visualizar/' + resp.responsavel.id, "_blank", "noreferrer noopener")}
                      title={pessoaNomeAbreviadoMask(resp.responsavel.nome)}
                      thumbnail={resp.responsavel.user?.thumbnail}
                      subtitle={resp.responsavel.setor?.sigla}
                      dataInicio={resp.inicio}
                      dataFim={resp.fim} 
                      isMain={resp.principal}/>
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
                        <Col md={3} className=""><strong>Nome</strong></Col>
                        <Col><span>{projeto.contato?.nome}</span></Col>
                      </Row>
                      <Row className="mb-1">
                        <Col md={3} className=""><strong>Email</strong></Col>
                        <Col><ClipboardContainer>{projeto.contato?.email}</ClipboardContainer></Col>
                      </Row>
                      <Row className="mb-1">
                        <Col md={3} className=""><strong>Telefone</strong></Col>
                        <Col><ClipboardContainer>{projeto.contato?.telefone}</ClipboardContainer></Col>
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
            <h1 className="w-auto">Tarefas {tarefaLoading && <Spinner style={{ fontSize: '0.59rem' }} />}</h1>
          </Row>
          <Row className="d-flex justify-content-center mb-3 px-5">
            <Accordion flush >
              <Accordion.Item eventKey="0" >
                <Accordion.Header className="flex-row-center">Filtros</Accordion.Header>
                <Accordion.Body>
                  <Row className="d-flex justify-content-center">
                    <Col md={3}>
                      <Form.Label>Interrompidos</Form.Label>
                      <Form.Check
                        label="Interrompidos"
                        type="checkbox"
                        checked={filtersState.deleted}
                        onChange={() => handleChangeFilters('deleted', !filtersState.deleted)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Label>Filtrar por Executor</Form.Label>
                      <SelectAsync
                        placeholder=""
                        loadOptions={(search) => listProjetoResponsavel(`?projeto=${params.id}&search=${search}`)}
                        value={filtersState.colaborador}
                        getOptionLabel={(option) => option.responsavel.nome}
                        getOptionValue={(option) => option.responsavel.id}
                        onChange={(colaborador) => handleChangeFilters('colaborador', colaborador)} />
                    </Col>
                    <Col md={3}>
                      <Form.Label>Pesquisar</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={"por nome"}
                        value={filtersState.search}
                        onChange={({ target: { value } }) => handleChangeFilters('search', value)}
                      />
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
        </>
      )}
      <KanbanBoard
        ref={kanban}
        disabled={filtersState.deleted}
        onChangeTask={(task) => updatePositionTasks(task)}
        onAddClick={(tarefa_status) => modalTarefa.current.show({ ...MOCK_tarefa, tarefa_status, projeto_id: projeto.id })}
        onEditClick={(row) => modalTarefa.current.show(row)}
        fieldColumnPivot="id"
        fieldTaskPivot="tarefa_status_id" />
      <ModalTarefa ref={modalTarefa} onHide={(forceReLoad) => loadTarefas(forceReLoad)} onDelete={removeTarefa} onSuccess={() => loadTarefas} />
    </Background>
  );
}

export default () => (
  <ProjetoProvider>
    <Projeto />
  </ProjetoProvider>
) 