import PieChartCard from "@/components/Charts/PieChartCard";
import ProjetosByStatusChart from "@/components/Charts/ProjetosByStatusChart";
import TarefasByStatusChart from "@/components/Charts/TarefasByStatusChart";
import TarefasByAndamentoChart from "@/components/Charts/TarefasByAndamentoChart";
import { HeaderTitle, Section } from "@/components/index";
import { listClientes } from "@/services/clientes";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetosByStatus } from "@/services/dashboard";
import { listEmpresas } from "@/services/empresas";
import { listProjetoStatus } from "@/services/projeto/projetoStatus";
import { listProjetos } from "@/services/projeto/projetos";
import { listSetores } from "@/services/setores";
import { listTarefaStatus } from "@/services/tarefa/tarefaStatus";
import { listTarefas } from "@/services/tarefa/tarefas";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { buildQueryString, capitalize } from "@/utils/helpers/format";
import { formatForm } from "@/utils/helpers/forms";
import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const filtersInitialValue = {
  cliente: null,
  projeto: null,
  colaborador: null,
  setor: null,
  empresa: null,
  projeto_status: null,
  tarefa_status: null,
};
export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoaded, isLogged, user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const [filters, setFilters] = useState(filtersInitialValue);
  const ProjetosByStatusChartRef = useRef(null);
  const TarefasByStatusChartRef = useRef(null);
  const TarefasByAndamentoChartRef = useRef(null);

  function callModalFilter(data) {
    callGlobalDialog({
      title: 'Filtros',
      data,
      forms: [
        {
          name: 'cliente',
          label: 'Cliente',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listClientes,
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
          name: 'setor',
          label: 'Setor',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listSetores,
        },
        {
          name: 'empresa',
          label: 'Empresa',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listEmpresas,
        },
        {
          name: 'projeto_status',
          label: 'Status de Projeto',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listProjetoStatus,
        },
        {
          name: 'tarefa_status',
          label: 'Status da Tarefa',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listTarefaStatus,
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
          'setor',
          'empresa',
          'projeto_status',
          'tarefa_status',
        ]).getResult()
      })
      .then(async (result) => {
        load(result)
      })

  }
  function load(params = {}) {
    ProjetosByStatusChartRef.current.load(params)
    TarefasByStatusChartRef.current.load(params)
    TarefasByAndamentoChartRef.current.load(params)
  }

  const filtersIsEmpty = useMemo(() => !Object.keys(filters).find(e => !!filters[e]), [filters]);

  useEffect(() => {
    load()
  }, []);

  const data1 = [
    { name: 'Category 1', y: 30 },
    { name: 'Category 2', y: 20 },
    { name: 'Category 3', y: 50 },
  ];

  const data2 = [
    { name: 'Category A', y: 40 },
    { name: 'Category B', y: 25 },
    { name: 'Category C', y: 35 },
  ];

  return (
    <Container style={{}}>
      <HeaderTitle title="DashBoards" enabledBreadcrumb={false} optionsButtons={[
        {
          label: '',
          onClick: () => callModalFilter(filters),
          icon: FiFilter,
        },
      ]} />
      {!filtersIsEmpty && (
        <Row style={{
          backgroundColor: 'rgba(13, 0, 77, 0.29)',
          padding: ' 12px 6px',
          marginBottom: 10,
          animation: "ease-in-out"
        }}>
          <h5>Filtros</h5>
          <Row>
            {Object.keys(filters).map((key) => !!filters[key] && (
              <Col>
                <b>{capitalize(key.replace('_', ' '))}</b><br/>
                <span>{filters[key].nome}</span>
              </Col>
            ))}
          </Row>
        </Row>
      )}
      <Row>
        <Col>
          <ProjetosByStatusChart ref={ProjetosByStatusChartRef} />
          {/* <PieChartCard title="Chart 1" data={data2} /> */}
        </Col>
        {/* Adicione mais PieChartCard aqui para formar a grade 2x3 */}
        <Col>
          <TarefasByStatusChart ref={TarefasByStatusChartRef} />
        </Col>
      </Row>
      <Row>
        <Col>
          <TarefasByAndamentoChart ref={TarefasByAndamentoChartRef} />
        </Col>
      </Row>
    </Container>
  );
}
