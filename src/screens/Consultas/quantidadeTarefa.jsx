import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetos } from "@/services/projeto/projetos";
import { listTarefasPorAgrupamento } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { DateTest } from "@/components/index";
import { listSetores } from "@/services/setores";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'id',
  colaborador: null,
  sortOrder: 'asc',
};

const columnsFields = [
  {
    field: 'inicio_antes_do_periodo',
    label: 'Início Antes do Período',
    colspan: 10,
    subColumns: [
      {
        field: 'inicio_fim_antes_periodo',
        label: 'Fim Antes do Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_antes_periodo_fim_antes_periodo_no_prazo', label: 'Prazo' },
          { field: 'inicio_antes_periodo_fim_antes_periodo_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'inicio_antes_fim_no_periodo',
        label: 'Fim no Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_antes_periodo_fim_no_periodo_no_prazo', label: 'Prazo' },
          { field: 'inicio_antes_periodo_fim_no_periodo_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'inicio_antes_fim_apos_periodo',
        label: 'Fim Fora do Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_antes_periodo_fim_fora_periodo_no_prazo', label: 'Prazo' },
          { field: 'inicio_antes_periodo_fim_fora_periodo_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'inicio_antes_periodo_nao_finalizada',
        label: 'Não Terminou',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_antes_periodo_nao_finalizado_no_prazo', label: 'Prazo' },
          { field: 'inicio_antes_periodo_nao_finalizado_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'total',
        label: 'Total Antes do Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_antes_periodo_total_prazo', label: 'Prazo' },
          { field: 'inicio_antes_periodo_total_atraso', label: 'Atrasado' }
        ]
      },
    ]
  },
  {
    field: 'inicio_no_periodo',
    label: 'Início no Período',
    colspan: 8,
    subColumns: [
      {
        field: 'inicio_fim_no_periodo',
        label: 'Fim no Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_no_periodo_fim_no_periodo_no_prazo', label: 'Prazo' },
          { field: 'inicio_no_periodo_fim_no_periodo_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'inicio_fim_apos_periodo',
        label: 'Fim Fora do Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_no_periodo_fim_fora_periodo_no_prazo', label: 'Prazo' },
          { field: 'inicio_no_periodo_fim_fora_periodo_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'inicio_fim_apos_periodo_nao_finalizada',
        label: 'Não Terminou',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_periodo_nao_finalizado_no_prazo', label: 'Prazo' },
          { field: 'inicio_periodo_nao_finalizado_em_atraso', label: 'Atrasado' }
        ]
      },
      {
        field: 'total',
        label: 'Total no Período',
        colspan: 2,
        nestedColumns: [
          { field: 'inicio_no_periodo_total_prazo', label: 'Prazo' },
          { field: 'inicio_no_periodo_total_atraso', label: 'Atrasado' }
        ]
      },
    ]
  },
  {
    field: 'nao_iniciada',
    label: 'Não Iniciada',
    colspan: 2,
    subColumns: [
      { field: 'nao_iniciado_no_prazo', label: 'Prazo' },
      { field: 'nao_iniciado_em_atraso', label: 'Atrasado' }
    ]
  },
  {
    field: 'total',
    label: 'Total',
    colspan: 2,
    subColumns: [
      { field: 'total_no_prazo', label: 'Prazo' },
      { field: 'total_em_atraso', label: 'Atrasado' }
    ]
  },
];

export default function ConsultaQuantidadeTarefa() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const {
    rows,
    columns,
    load,
    filtersState,
    isTableLoading,
    handleChangeFilters,
    resetFilters,
    isEmpty,
  } = useTable(columnsFields, listTarefasPorAgrupamento, basefilters, (results) => {
    if (!results || Object.keys(results).length === 0) {
      return [];
    }
    const mappedData = {

      inicio_antes_periodo_fim_antes_periodo_no_prazo: results.inicio_antes_periodo ? results.inicio_antes_periodo.fim_antes_periodo.no_prazo : 0,
      inicio_antes_periodo_fim_antes_periodo_em_atraso: results.inicio_antes_periodo ? results.inicio_antes_periodo.fim_antes_periodo.em_atraso : 0,

      inicio_antes_periodo_fim_no_periodo_no_prazo: results.inicio_antes_periodo ? results.inicio_antes_periodo.fim_no_periodo.no_prazo : 0,
      inicio_antes_periodo_fim_no_periodo_em_atraso: results.inicio_antes_periodo ? results.inicio_antes_periodo.fim_no_periodo.em_atraso : 0,

      inicio_antes_periodo_fim_fora_periodo_no_prazo: results.inicio_antes_periodo ? results.inicio_antes_periodo.fim_fora_periodo.no_prazo : 0,
      inicio_antes_periodo_fim_fora_periodo_em_atraso: results.inicio_antes_periodo ? results.inicio_antes_periodo.fim_fora_periodo.em_atraso : 0,

      inicio_antes_periodo_nao_finalizado_no_prazo: results.inicio_antes_periodo ? results.inicio_antes_periodo.nao_finalizado.no_prazo : 0,
      inicio_antes_periodo_nao_finalizado_em_atraso: results.inicio_antes_periodo ? results.inicio_antes_periodo.nao_finalizado.em_atraso : 0,

      inicio_antes_periodo_total_prazo: results.inicio_antes_periodo ? results.inicio_antes_periodo.total_prazo : 0,
      inicio_antes_periodo_total_atraso: results.inicio_antes_periodo ? results.inicio_antes_periodo.total_atraso : 0,

      inicio_no_periodo_fim_no_periodo_no_prazo: results.inicio_no_periodo ? results.inicio_no_periodo.fim_no_periodo.no_prazo : 0,
      inicio_no_periodo_fim_no_periodo_em_atraso: results.inicio_no_periodo ? results.inicio_no_periodo.fim_no_periodo.em_atraso : 0,

      inicio_no_periodo_fim_fora_periodo_no_prazo: results.inicio_no_periodo ? results.inicio_no_periodo.fim_fora_periodo.no_prazo : 0,
      inicio_no_periodo_fim_fora_periodo_em_atraso: results.inicio_no_periodo ? results.inicio_no_periodo.fim_fora_periodo.em_atraso : 0,

      inicio_periodo_nao_finalizado_no_prazo: results.inicio_no_periodo ? results.inicio_no_periodo.nao_finalizado.no_prazo : 0,
      inicio_periodo_nao_finalizado_em_atraso: results.inicio_no_periodo ? results.inicio_no_periodo.nao_finalizado.em_atraso : 0,

      inicio_no_periodo_total_prazo: results.inicio_no_periodo ? results.inicio_no_periodo.total_prazo : 0,
      inicio_no_periodo_total_atraso: results.inicio_no_periodo ? results.inicio_no_periodo.total_atraso : 0,

      nao_iniciado_no_prazo: results.nao_iniciado ? results.nao_iniciado.no_prazo : 0,
      nao_iniciado_em_atraso: results.nao_iniciado ? results.nao_iniciado.em_atraso : 0,

      total_no_prazo: results.total_no_prazo || 0,
      total_em_atraso: results.total_em_atraso || 0
    };

    return [mappedData];
  });

  useEffect(() => {
    handleChangeFilters('search', basefilters.search);
    load();
    if (dataInicio && dataFim) {
      handleChangeFilters('data_inicio', dataInicio);
      handleChangeFilters('data_fim', dataFim);
    } else if (!dataInicio && !dataFim) {
      handleChangeFilters('data_inicio', null);
      handleChangeFilters('data_fim', null);
    }
  }, [basefilters.search, dataInicio, dataFim]);

  return (
    <Background>
      <HeaderTitle
        title="Consultar Agrupamentos de Tarefas" />
      <Section>
        <Table
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          filtersComponentes={
            <>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Colaborador"
                  loadOptions={(search) => listColaboradores('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(colaborador) => {
                    handleChangeFilters('colaborador_id', colaborador ? colaborador.id : null);
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Projeto"
                  loadOptions={(search) => listProjetos('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(projeto) => {
                    handleChangeFilters('projeto_id', projeto ? projeto.id : null);
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                  onChange={(setor) => {
                    handleChangeFilters('setor_id', setor ? setor.id : "");
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <DateTest
                  id="dataFim"
                  value={dataFim}
                  label="Fim:"
                  onChange={(date) => {
                    setDataFim(date);
                    handleChangeFilters('data_fim', date);
                  }}
                />
              </Col>
              <Col md={2}>
                <DateTest
                  id="dataInicio"
                  value={dataInicio}
                  label="Início:"
                  onChange={(date) => {
                    setDataInicio(date);
                    handleChangeFilters('data_inicio', date);
                  }}
                />
              </Col>
            </>
          }
          handleFilters={handleChangeFilters}

        />
      </Section>
    </Background>
  );
}