import { HeaderTitle, Section } from "@/components/index";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listTarefasByTime } from "@/services/dashboard";
import { listEmpresas } from "@/services/empresas";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { buildQueryString, capitalize } from "@/utils/helpers/format";
import { formatForm } from "@/utils/helpers/forms";
import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { listProjetos } from "@/services/projeto/projetos";
import { useDebouncedCallback } from "use-debounce";
import moment from "moment/moment";

const filtersInitialValue = {
  cliente: null,
  projeto: null,
  colaborador: null,
  tipo: 'data_fim_programado',
  data1: null,
  data2: null,
  intervalType: null
};
export default function TarefaDashboard() {
  const { isLoaded, isLogged, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [visualizacao, setVisualizacao] = useState('dayGridMonth');
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const [filters, setFilters] = useState({ ...filtersInitialValue, colaborador: user.colaborador });

  const handleMudancaVisualizacao = useDebouncedCallback((novaVisualizacao, callback) => {
    const startOriginal = moment(novaVisualizacao.startStr);
    const startFormatada = startOriginal.format('YYYY-MM-DD HH:mm:ss');

    const endOriginal = moment(novaVisualizacao.endStr);
    const endFormatada = endOriginal.format('YYYY-MM-DD HH:mm:ss');

    setVisualizacao(novaVisualizacao);
    let updatedFilters = { ...filters, intervalType: 'personalizado', data1: startFormatada, data2: endFormatada }
    setFilters(updatedFilters)
    let formatedFilters = formatForm(updatedFilters).rebaseIds([
      'cliente',
      'projeto',
      'colaborador',
    ]).getResult()
    load(formatedFilters)
  }, 500);


  const eventos = data.map((tarefa) => {


    let eventoProgramado = {
      id: tarefa.id,
      title: tarefa.nome,



      start: tarefa.data_inicio_real || tarefa.data_inicio_programado,
      extendedProps: {
        ...tarefa,
        projectName: tarefa.projeto.nome,
        hourType: tarefa.data_inicio_real ? 'Inicio Real' : 'Inicio Programado'
      },
      end: tarefa.data_fim_real || tarefa.data_fim_programado || new Date(),
      backgroundColor: tarefa.andamento.color,
      borderColor: tarefa.andamento.color,
    };

    return [eventoProgramado];
  }).flat();

  function callModalFilter(data) {
    callGlobalDialog({
      title: 'Filtros',
      data,
      forms: [

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
            // { value: 'created_at', label: 'Data de criação' },
          ]
        },

      ],
      labelSucessColor: 'primary',
      labelSuccess: 'Filtrar',
      labelCancel: 'Cancelar',
    })
      .then((result) => {
        setFilters({ ...result })
        return formatForm(result).rebaseIds([
          'cliente',
          'projeto',
          'colaborador',
        ]).getResult()
      })
      .then(async (result) => {
        load(result, true)
      })

  }
  const filtersIsEmpty = useMemo(() => !Object.keys(filters).find(e => !!filters[e]), [filters]);

  function load(params = {}, resetData = false) {
    listTarefasByTime(buildQueryString(params))
      .then((resultsList) => {
        if (resetData) return setData(resultsList)
        let copy = [...data, ...resultsList];
        setData([...new Map(copy.map(item =>
          [item['id'], item])).values()]);
      })
  }

  // useEffect(() => {
  //   load()
  // }, []);
  const renderTooltip = (event) => (
    <Tooltip id={`tooltip-${event.id}`}>
      <strong>{event.extendedProps.projectName}</strong><br />
      <hr />
      <strong>{event.title}</strong><br />
      {event.start && event.end && (
        <>
          {event.start.toLocaleDateString()} - {event.end.toLocaleDateString()}
        </>
      )}
      {!event.start && event.end && (
        <>
          {event.end.toLocaleDateString()}
        </>
      )}
      {event.start && !event.end && (
        <>
          {event.start.toLocaleDateString()}
        </>
      )}
      <p>{event.extendedProps.andamento.label}</p>
      <p>Executores</p>
      <ul style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {event.extendedProps.tarefa_colaborador.map(t => <li>{t.colaborador.nome}</li>)}
      </ul>
    </Tooltip>
  );

  return (
    <Container style={{}}>
      <HeaderTitle title={filters.projeto !== null ? filters.projeto.nome : 'Tarefa dashBoard'} enabledBreadcrumb={false} optionsButtons={[
        {
          label: '',
          onClick: () => callModalFilter(filters),
          icon: FiFilter,
        },
      ]} />
      {!filtersIsEmpty && (
        <Row style={{
          backgroundColor: 'rgba(35, 38, 43, 0.29)',
          padding: ' 12px 6px',
          marginBottom: 10,
          animation: "ease-in-out"
        }}>
          <h5>Filtros</h5>
          <Row>
            {(['colaborador', 'tipo', 'projeto']).map((key) => {
              if (filters[key]) {
                console.log(filters[key]);
                const displayText =
                  typeof filters[key] === 'object' && filters[key].nome
                    ? filters[key].nome
                    : capitalize(filters[key].replace(/_/g, ' ')); // Replace all underscores globally

                return (
                  <Col key={key} className="filter" style={{ maxWidth: "350px" }}>
                    <b>{capitalize(key.replace('_', ' '))}</b><br />
                    {displayText}
                  </Col>
                );
              }
              return null;
            })}
          </Row>

        </Row>
      )}

      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={visualizacao}
          locale={'pt-br'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          datesSet={handleMudancaVisualizacao}
          events={eventos}

          eventClick={(info) => {
            // navigate(`/projetos/visualizar/${info.event.extendedProps.projeto_id}?tarefa=${info.event.id}`)
            window.open(`/projetos/visualizar/${info.event.extendedProps.projeto_id}?tarefa=${info.event.id}`, "_blank", "noreferrer noopener")
          }}
          onActiveStartDateChange={handleMudancaVisualizacao}
          eventDisplay="block"
          eventContent={(eventInfo) => (
            <>
              <OverlayTrigger
                // ...rest of the code
                overlay={renderTooltip(eventInfo.event)}
              >
                <div style={{ fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: eventInfo.event.backgroundColor === 'var(--bs-warning)' ? 'black' : null }}>
                  <div style={{ marginBottom: '2px' }}>
                    <b>{eventInfo.event.extendedProps.hourType}:</b> {moment(eventInfo.event.start).format('HH:mm')}
                  </div>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <i>
                      {filters.projeto ? `Tarefa: ${eventInfo.event.title}` : `Projeto: ${eventInfo.event.extendedProps.projectName}`}
                    </i>

                  </div>
                </div>
              </OverlayTrigger>



            </>
          )}

        />
      </div>
    </Container>
  );
}
