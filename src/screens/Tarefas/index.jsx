import { Background, HeaderTitle, Section } from "@/components/index"
import { listColaboradores } from "@/services/colaborador/colaboradores"
import { listTarefasByTime } from "@/services/dashboard"
import { listDiasNaoUteis } from "@/services/feriados"
import { listProjetos } from "@/services/projeto/projetos"
import { listSetores } from "@/services/setores"
import { useAuth } from "@/utils/context/AuthProvider"
import { useTheme } from "@/utils/context/ThemeProvider"
import { buildQueryString, capitalize } from "@/utils/helpers/format"
import { formatForm } from "@/utils/helpers/forms"
import { useEffect, useMemo, useRef, useState } from "react"
import { Col, Container, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap"
import { FiFilter } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import FullCalendar from '@fullcalendar/react'
import allLocales from '@fullcalendar/core/locales-all'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from "moment/moment"

let resetData = true
let ultimoColaborador = null

const filtersInitialValue = {
  cliente: null,
  projeto: null,
  colaborador: null,
  tipo: 'data_fim_programado',
  data1: null,
  data2: null,
  intervalType: null,
  apresentado: 'somente_selecionado'
}

export default function Tarefas() {
  const { isLoaded, isLogged, user } = useAuth()
  const restrito = ['setor', 'colaborador']
  const navigate = useNavigate()
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme()
  const [data, setData] = useState([])
  const [diasNaoUteis, setDiasNaoUteis] = useState([])
  const [filters, setFilters] = useState({ ...filtersInitialValue, colaborador: user.colaborador })
  const filtersIsEmpty = useMemo(() => !Object.keys(filters).find(e => !!filters[e]), [filters])
  ultimoColaborador = user.id

  const eventos = []

  diasNaoUteis.forEach(diaNaoUtil => {
    if(diaNaoUtil.tipo !== 'final_de_semana') {
      eventos.push({
        title: diaNaoUtil.nome,
        start: moment(diaNaoUtil.data).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(diaNaoUtil.data).format('YYYY-MM-DD HH:mm:ss'),
        extendedProps: {
          feriado: true,
          nomeFeriado: diaNaoUtil.nome,
        }
      })
    }
  })

  data.forEach(tarefa => {
    let datasTarefa = {...tarefa}
    let ultimoDiaNaoUtilUtilizado = moment('1970-01-01')

    diasNaoUteis.forEach((diaNaoUtil, index, array) => {
      let start, end
      switch(filters.tipo) {
        case 'data_inicio_programado':
          start = moment(datasTarefa.data_inicio_programado)
          end = moment(datasTarefa.data_fim_programado || new Date())
          tarefa.start = index === 0 ? start : tarefa.start
          tarefa.end = index === 0 ? end : tarefa.end
          break
        case 'data_fim_programado':
          start = moment(datasTarefa.data_inicio_programado || new Date('1970-01-01'))
          end = moment(datasTarefa.data_fim_programado)
          tarefa.start = index === 0 ? start : tarefa.start
          tarefa.end = index === 0 ? end : tarefa.end
          break
        case 'data_inicio_real':
          start = moment(datasTarefa.data_inicio_real)
          end = moment(datasTarefa.data_fim_real || new Date())
          tarefa.start = index === 0 ? start : tarefa.start
          tarefa.end = index === 0 ? end : tarefa.end
          break
        case 'data_fim_real':
          start = moment(datasTarefa.data_inicio_real || new Date('1970-01-01'))
          end = moment(datasTarefa.data_fim_real)
          tarefa.start = index === 0 ? start : tarefa.start
          tarefa.end = index === 0 ? end : tarefa.end
          break
      }

      const diaNaoUtilMoment = moment(diaNaoUtil.data)

      if(diaNaoUtilMoment.isBetween(start, end, 'date', '[]')) {

        if(diaNaoUtilMoment.diff(ultimoDiaNaoUtilUtilizado, 'days') !== 1) {
          eventos.push({
            id: tarefa.id,
            title: tarefa.nome,
            start: start.format('YYYY-MM-DD HH:mm:ss'),
            end: moment(diaNaoUtilMoment).subtract(1, 'day').format('YYYY-MM-DD 18:mm:ss'),
            backgroundColor: tarefa.andamento.color,
            borderColor: tarefa.andamento.color,
            extendedProps: {
              ...tarefa,
              feriado: false,
              projectName: tarefa.projeto.nome,
              hourType: tarefa.data_inicio_real ? 'Inicio Real' : 'Inicio Programado'
            }
          })
        }

        ultimoDiaNaoUtilUtilizado = moment(diaNaoUtilMoment)

        const atributos = ['data_inicio_real', 'data_inicio_programado']
        diaNaoUtilMoment.add(1, 'day')
        atributos.forEach(atributo => {
            datasTarefa[atributo] = diaNaoUtilMoment.format('YYYY-MM-DD 09:mm:ss')
        })
      } else if(index === array.length - 1) {
        eventos.push({
          id: tarefa.id,
          title: tarefa.nome,
          start: start.format('YYYY-MM-DD 09:mm:ss'),
          end: end.format('YYYY-MM-DD HH:mm:ss'),
          backgroundColor: tarefa.andamento.color,
          borderColor: tarefa.andamento.color,
          extendedProps: {
            ...tarefa,
            feriado: false,
            projectName: tarefa.projeto.nome,
            hourType: tarefa.data_inicio_real ? 'Inicio Real' : 'Inicio Programado'
          }
        })
      }
    })
  })

  function callModalFilter(data) {
    const forms = [
      {
        name: 'setor',
        label: 'Setor',
        type: 'selectAsync',
        isClearable: true,
        loadOptions: listSetores,
      },
      {
        name: 'projeto',
        label: 'Projeto',
        type: 'selectAsync',
        isClearable: true,
        loadOptions: listProjetos,
      },
      {
        name: 'colaborador',
        label: 'Colaborador',
        type: 'selectAsync',
        isClearable: true,
        loadOptions: listColaboradores,
      },
      {
        name: 'tipo',
        label: 'Data de referência',
        type: 'select',
        options: [
          { value: 'data_fim_programado', label: 'Fim Estimado' },
          { value: 'data_inicio_programado', label: 'Inicio Estimado' },
          { value: 'data_inicio_real', label: 'Inicio Em' },
          { value: 'data_fim_real', label: 'Finalizado Em' },
        ]
      },
      {
        name: 'apresentado',
        label: 'Modo de calendário',
        type: 'select',
        options: [
          { value: 'Somente_selecionado', label: 'Somente selecionado' },
          { value: 'completo', label: 'Período Completo' }

        ]
      },
    ]

    callGlobalDialog({
      title: 'Filtros',
      data,
      forms: user.nivel_acesso === 1 ? 
        forms.filter(item => !restrito.includes(item.name)) : forms,
      labelSucessColor: 'primary',
      labelSuccess: 'Filtrar',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        let colaboradorAlterado = false
        if (result.apresentado == 'completo') {
          resetData = false
          if (ultimoColaborador !== result.colaborador.id) {
            colaboradorAlterado = true
            ultimoColaborador = result.colaborador.id
          }
        }
        else {
          resetData = true
        }

        await load({ ...result }, resetData, colaboradorAlterado)
      })

  }

  async function load(params, resetData, colaboradorAlterado) {
    const formatedParams = formatForm(params).rebaseIds([
      'setor',
      'cliente',
      'projeto',
      'colaborador',
      'apresentado'
    ]).getResult()

    const tarefas = await listTarefasByTime(buildQueryString(formatedParams))

    const diasNaoUteis = await listDiasNaoUteis(buildQueryString({
      data_inicio: params.data1,
      data_fim: params.data2
    }))

    setFilters(params)
    setDiasNaoUteis(diasNaoUteis)

    let updatedData
    if (resetData) {
      setData(tarefas)
    } else {
      updatedData = colaboradorAlterado ? [...tarefas] : [...data, ...tarefas]
      setData([...new Map(updatedData.map(item => [item['id'], item])).values()])
    }
  }

  const handleMudancaVisualizacao = async (dateInfo) => {
    const params = { 
      ...filters, 
      intervalType: 'personalizado', 
      data1: dateInfo.startStr.split('T')[0], 
      data2: dateInfo.endStr.split('T')[0]
    }

    await load(params, resetData)
  }

  const renderTooltip = (event) => (
    <Tooltip id={`tooltip-${event.id}`}>
      <strong>{event.extendedProps.projectName}</strong><br />
      <hr />
      <strong>{event.title}</strong><br />
      {event.start && event.end && (
        <>
          {event.extendedProps.start.format('DD/MM/YYYY')} - {event.extendedProps.end.format('DD/MM/YYYY')}
        </>
      )}
      {!event.start && event.end && (
        <>
          {event.extendedProps.end.format('DD/MM/YYYY')}
        </>
      )}
      {event.start && !event.end && (
        <>
          {event.extendedProps.start.format('DD/MM/YYYY')}
        </>
      )}
      <p>{event.extendedProps.andamento?.label}</p>
      <p>Executores</p>
      <ul style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {event.extendedProps.tarefa_colaborador.map((t, index) => <li key={index}>{t.colaborador.nome}</li>)}
      </ul>
    </Tooltip>
  )

  return (
    <Background>

      <HeaderTitle title="Tarefas" optionsButtons={[
          {
            label: 'Filtros',
            onClick: () => callModalFilter(filters),
            icon: FiFilter,
          },
        ]} 
      />

      <Container fluid="md">

        {!filtersIsEmpty && (
          <Row style={{
            backgroundColor: 'rgba(35, 38, 43, 0.29)',
            padding: ' 12px 6px',
            marginBottom: 10,
            animation: "ease-in-out"
          }}>
            <h5>Filtros</h5>
            <Row>
              {(['setor', 'colaborador', 'tipo', 'projeto', 'apresentado']).map((key) => {
                if (filters[key] && (!restrito.includes(key) || user.nivel_acesso > 1)) {
                  const displayText =
                    typeof filters[key] === 'object' && filters[key].nome
                      ? filters[key].nome
                      : capitalize(filters[key].replace(/_/g, ' '))

                  return (
                    <Col key={key} className="filter" style={{ maxWidth: "350px" }}>
                      <b>{capitalize(key.replace('_', ' '))}</b><br />
                      {displayText}
                    </Col>
                  )
                }
                return null
              })}
            </Row>

          </Row>
        )}

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          locales={allLocales}
          locale={'pt-br'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          datesSet={handleMudancaVisualizacao}
          events={eventos}
          eventClick={({ event }) => {
            if(!event.extendedProps.feriado)
              window.open(`/projetos/visualizar/${event.extendedProps.projeto_id}?tarefa=${event.id}`, "_blank", "noreferrer noopener")
          }}
          eventContent={({ event }) => {
            const mainStyle = {
              borderRadius: '5px',
              color: event.backgroundColor === 'var(--bs-warning)' ? 'black' : 'var(--bs-white)', 
              fontSize: 16, 
              overflow: 'hidden', 
              padding: '.5rem',
              textOverflow: 'ellipsis',
              width: '100%'
            }

            const feriadoStyle = {
              ...mainStyle,
              backgroundColor: 'var(--bs-indigo)',
              borderColor: 'var(--bs-indigo)',
              cursor: 'default',
              textAlign: 'center',
              whiteSpace: 'wrap'
            }

            const tarefaStyle = {
              ...mainStyle,
              backgroundColor: event.extendedProps.andamento?.color,
              borderColor: event.extendedProps.andamento?.color,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }

            return event.extendedProps.feriado ?
              (
                <>
                  <div style={feriadoStyle}>
                      {event.extendedProps.nomeFeriado}
                  </div>
                </>
              )
            :
              (
                <OverlayTrigger overlay={renderTooltip(event)}>
                  <div style={tarefaStyle}>

                    <div style={{ marginBottom: '2px' }}>
                      <b>{event.extendedProps.hourType}:</b> {moment(event.extendedProps.start).format('HH:mm')}
                    </div>

                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <i>
                        {filters.projeto ? `Tarefa: ${event.title}` : `Projeto: ${event.extendedProps.projectName}`}
                      </i>
                    </div>

                  </div>
                </OverlayTrigger>
              )
          }}
        />

      </Container>

    </Background>
  )
}
