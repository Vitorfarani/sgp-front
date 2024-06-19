import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetos } from "@/services/projeto/projetos";
import { listTarefasPorAgrupamento } from "@/services/consultas/consultas";
import { Button, Col } from "react-bootstrap";
import { DateTest } from "@/components/index";
import { listSetores } from "@/services/setores";
import { FiEye, FiEyeOff } from 'react-icons/fi';


const basefilters = {
  search: '',
  perPage: 20,
  //selectedRows: [],
  page: 1,
  sortedColumn: 'id',
  colaborador: null,
  sortOrder: 'asc',
};

const columnsFields = [
  {
    field: 'colaborador_nome',
    label: 'Colaborador',
    backgroundColor: '#331b3b',
    color: '#FFFFFF',
    enabledOrder: true,
    colspan: 1,
  },
  {
    field: 'inicio_antes_do_periodo',
    label: 'Início Antes do Período',
    colspan: 10,
    color: '#FFFFFF',
    backgroundColor: '#18304a',
    subColumns: [
      {
        field: 'inicio_fim_antes_periodo',
        label: 'Fim Antes do Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#18304a',
        nestedColumns: [
          { field: 'inicio_antes_periodo_fim_antes_periodo_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_antes_periodo_fim_antes_periodo_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'inicio_antes_fim_no_periodo',
        label: 'Fim no Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#18304a',
        nestedColumns: [
          { field: 'inicio_antes_periodo_fim_no_periodo_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_antes_periodo_fim_no_periodo_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'inicio_antes_fim_apos_periodo',
        label: 'Fim Fora do Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#18304a',
        nestedColumns: [
          { field: 'inicio_antes_periodo_fim_fora_periodo_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_antes_periodo_fim_fora_periodo_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'inicio_antes_periodo_nao_finalizada',
        label: 'Não Terminou',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#18304a',
        nestedColumns: [
          { field: 'inicio_antes_periodo_nao_finalizado_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_antes_periodo_nao_finalizado_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'total',
        label: 'Total Antes do Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#18304a',
        nestedColumns: [
          { field: 'inicio_antes_periodo_total_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_antes_periodo_total_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
    ]
  },
  {
    field: 'inicio_no_periodo',
    label: 'Início no Período',
    colspan: 8,
    color: '#FFFFFF',
    backgroundColor: '#242825',
    subColumns: [
      {
        field: 'inicio_fim_no_periodo',
        label: 'Fim no Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#242825',
        nestedColumns: [
          { field: 'inicio_no_periodo_fim_no_periodo_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_no_periodo_fim_no_periodo_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'inicio_fim_apos_periodo',
        label: 'Fim Fora do Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#242825',
        nestedColumns: [
          { field: 'inicio_no_periodo_fim_fora_periodo_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_no_periodo_fim_fora_periodo_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'inicio_fim_apos_periodo_nao_finalizada',
        label: 'Não Terminou',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#242825',
        nestedColumns: [
          { field: 'inicio_periodo_nao_finalizado_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_periodo_nao_finalizado_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'total',
        label: 'Total no Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#242825',
        nestedColumns: [
          { field: 'inicio_no_periodo_total_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_no_periodo_total_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
    ]
  },
  {
    field: 'inicio_apos_periodo',
    label: 'Início Após Período',
    colspan: 4,
    color: '#FFFFFF',
    backgroundColor: '#330a04',
    subColumns: [
      {
        field: 'inicio_apos_periodo',
        label: 'Fim Após Período',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#330a04',
        nestedColumns: [
          { field: 'inicio_apos_periodo_fim_apos_periodo_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_apos_periodo_fim_apos_periodo_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
      {
        field: 'inicio_fim_apos_periodo',
        label: 'Não Terminou',
        colspan: 2,
        color: '#FFFFFF',
        backgroundColor: '#330a04',
        nestedColumns: [
          { field: 'inicio_apos_periodo_nao_finalizado_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
          { field: 'inicio_apos_periodo_nao_finalizado_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
        ]
      },
    ]
  },
  {
    field: 'nao_iniciada',
    label: 'Não Iniciada',
    colspan: 2,
    color: "#FFFFFF",
    backgroundColor: "#003e7c",
    subColumns: [
      { field: 'nao_iniciado_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
      { field: 'nao_iniciado_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
    ]
  },
  {
    field: 'total',
    label: 'Total',
    colspan: 2,
    color: "#FFFFFF",
    backgroundColor: "#1b243d",
    subColumns: [
      { field: 'total_no_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
      { field: 'total_em_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' },
    ]
  },
  {
    field: 'total_tarefas',
    label: 'Tarefas',
    color: "#FFFFFF",
    backgroundColor: "#4f5450"
  },

];

export default function ConsultaQuantidadeTarefa() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    colaborador_nome: true,
    inicio_antes_do_periodo: true,
    inicio_no_periodo: true,
    inicio_apos_periodo: true,
    nao_iniciada: true,
    total: true,
    total_tarefas: true,
  });
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

    const mappedData = Object.keys(results).map(colaboradorId => {
      const colaborador = results[colaboradorId];
    
      const abreviarNome = (nomeCompleto) => {
        const partesNome = nomeCompleto.split(' ');
        if (partesNome.length <= 1) return nomeCompleto; 
    
        const primeiroNome = partesNome[0];
        let sobrenomesAbreviados = [];
    
        for (let i = 1; i < partesNome.length; i++) {
          const nome = partesNome[i];
          if (!["DE", "DA", "DO"].includes(nome.toUpperCase())) {
            sobrenomesAbreviados.push(nome.charAt(0).toUpperCase() + '.');
          }
        }
    
        return `${primeiroNome} ${sobrenomesAbreviados.join(' ')}`;
      };
    
      return {
        colaborador_id: colaboradorId,
        colaborador_nome: abreviarNome(colaborador.colaborador_nome),
        //INICIO ANTES DO PERÍODO
        inicio_antes_periodo_fim_antes_periodo_no_prazo: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.fim_antes_periodo.no_prazo : 0,
        inicio_antes_periodo_fim_antes_periodo_em_atraso: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.fim_antes_periodo.em_atraso : 0,

        inicio_antes_periodo_fim_no_periodo_no_prazo: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.fim_no_periodo.no_prazo : 0,
        inicio_antes_periodo_fim_no_periodo_em_atraso: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.fim_no_periodo.em_atraso : 0,

        inicio_antes_periodo_fim_fora_periodo_no_prazo: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.fim_fora_periodo.no_prazo : 0,
        inicio_antes_periodo_fim_fora_periodo_em_atraso: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.fim_fora_periodo.em_atraso : 0,

        inicio_antes_periodo_nao_finalizado_no_prazo: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.nao_finalizado.no_prazo : 0,
        inicio_antes_periodo_nao_finalizado_em_atraso: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.nao_finalizado.em_atraso : 0,

        inicio_antes_periodo_total_prazo: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.total_prazo : 0,
        inicio_antes_periodo_total_atraso: colaborador.inicio_antes_periodo ? colaborador.inicio_antes_periodo.total_atraso : 0,

        //INICIO NO PERÍODO
        inicio_no_periodo_fim_no_periodo_no_prazo: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.fim_no_periodo.no_prazo : 0,
        inicio_no_periodo_fim_no_periodo_em_atraso: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.fim_no_periodo.em_atraso : 0,

        inicio_no_periodo_fim_fora_periodo_no_prazo: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.fim_fora_periodo.no_prazo : 0,
        inicio_no_periodo_fim_fora_periodo_em_atraso: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.fim_fora_periodo.em_atraso : 0,

        inicio_periodo_nao_finalizado_no_prazo: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.nao_finalizado.no_prazo : 0,
        inicio_periodo_nao_finalizado_em_atraso: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.nao_finalizado.em_atraso : 0,

        inicio_no_periodo_total_prazo: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.total_prazo : 0,
        inicio_no_periodo_total_atraso: colaborador.inicio_no_periodo ? colaborador.inicio_no_periodo.total_atraso : 0,

        //INICIO APÓS PERÍODO
        inicio_apos_periodo_fim_apos_periodo_no_prazo: colaborador.inicio_apos_periodo ? colaborador.inicio_apos_periodo.fim_apos_periodo.no_prazo : 0,
        inicio_apos_periodo_fim_apos_periodo_em_atraso: colaborador.inicio_apos_periodo ? colaborador.inicio_apos_periodo.fim_apos_periodo.em_atraso : 0,
        inicio_apos_periodo_nao_finalizado_no_prazo: colaborador.inicio_apos_periodo ? colaborador.inicio_apos_periodo.nao_finalizado.no_prazo : 0,
        inicio_apos_periodo_nao_finalizado_em_atraso: colaborador.inicio_apos_periodo ? colaborador.inicio_apos_periodo.nao_finalizado.em_atraso : 0,

        //NÃO INICIADAS
        nao_iniciado_no_prazo: colaborador.nao_iniciado ? colaborador.nao_iniciado.no_prazo : 0,
        nao_iniciado_em_atraso: colaborador.nao_iniciado ? colaborador.nao_iniciado.em_atraso : 0,

        //TOTAIS
        total_tarefas: colaborador.total_tarefas || 0,
        total_no_prazo: colaborador.total_no_prazo || 0,
        total_em_atraso: colaborador.total_em_atraso || 0,
      };
    });
      
        const totais = {
          colaborador_id: 'totais',
          colaborador_nome: 'TOTAL',
    
          inicio_antes_periodo_fim_antes_periodo_no_prazo: 0,
          inicio_antes_periodo_fim_antes_periodo_em_atraso: 0,
          inicio_antes_periodo_fim_no_periodo_no_prazo: 0,
          inicio_antes_periodo_fim_no_periodo_em_atraso: 0,
          inicio_antes_periodo_fim_fora_periodo_no_prazo: 0,
          inicio_antes_periodo_fim_fora_periodo_em_atraso: 0,
          inicio_antes_periodo_nao_finalizado_no_prazo: 0,
          inicio_antes_periodo_nao_finalizado_em_atraso: 0,
          inicio_antes_periodo_total_prazo: 0,
          inicio_antes_periodo_total_atraso: 0,
    
          inicio_no_periodo_fim_no_periodo_no_prazo: 0,
          inicio_no_periodo_fim_no_periodo_em_atraso: 0,
          inicio_no_periodo_fim_fora_periodo_no_prazo: 0,
          inicio_no_periodo_fim_fora_periodo_em_atraso: 0,
          inicio_periodo_nao_finalizado_no_prazo: 0,
          inicio_periodo_nao_finalizado_em_atraso: 0,
          inicio_no_periodo_total_prazo: 0,
          inicio_no_periodo_total_atraso: 0,
    
          inicio_apos_periodo_fim_apos_periodo_no_prazo: 0,
          inicio_apos_periodo_fim_apos_periodo_em_atraso: 0,
          inicio_apos_periodo_nao_finalizado_no_prazo: 0,
          inicio_apos_periodo_nao_finalizado_em_atraso: 0,
    
          nao_iniciado_no_prazo: 0,
          nao_iniciado_em_atraso: 0,
    
          total_tarefas: 0,
          total_no_prazo: 0,
          total_em_atraso: 0,
        };
    
        mappedData.forEach(item => {
          for (let key in totais) {
            if (key !== 'colaborador_id' && key !== 'colaborador_nome') {
              totais[key] += item[key];
            }
          }
        });
    
        mappedData.push(totais);

    return mappedData;
  });

  const toggleColumnVisibility = (columnName) => {
    setVisibleColumns((prevVisibleColumns) => ({
      ...prevVisibleColumns,
      [columnName]: !prevVisibleColumns[columnName],
    }));
  };

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
        title="Consultar Agrupamentos de Tarefas" optionsButtons={[
          {
            label: visibleColumns.inicio_antes_do_periodo ? 'Esconder Início Antes do Período' : 'Mostrar Início Antes do Período',
            onClick: () => toggleColumnVisibility('inicio_antes_do_periodo'),
            icon: visibleColumns.inicio_antes_do_periodo ? FiEyeOff : FiEye,
          },
          {
            label: visibleColumns.inicio_no_periodo ? 'Esconder Início no Período' : 'Mostrar Início no Período',
            onClick: () => toggleColumnVisibility('inicio_no_periodo'),
            icon: visibleColumns.inicio_no_periodo ? FiEyeOff : FiEye,
          },
          {
            label: visibleColumns.inicio_apos_periodo ? 'Esconder Início Após o Período' : 'Mostrar Início Após o Período',
            onClick: () => toggleColumnVisibility('inicio_apos_periodo'),
            icon: visibleColumns.inicio_apos_periodo ? FiEyeOff : FiEye,
          },
          {
            label: visibleColumns.nao_iniciada ? 'Esconder Não Iniciada' : 'Mostrar Não Iniciada',
            onClick: () => toggleColumnVisibility('nao_iniciada'),
            icon: visibleColumns.nao_iniciada ? FiEyeOff : FiEye,
          },
          {
            label: visibleColumns.total ? 'Esconder Total' : 'Mostrar Total',
            onClick: () => toggleColumnVisibility('total'),
            icon: visibleColumns.total ? FiEyeOff : FiEye,
          },
          {
            label: visibleColumns.total_tarefas ? 'Esconder Total de Tarefas' : 'Mostrar Total de Tarefas',
            onClick: () => toggleColumnVisibility('total_tarefas'),
            icon: visibleColumns.total_tarefas ? FiEyeOff : FiEye,
          },
        ]}
      />
      <Section>
        <Table
          columns={columns.filter((column) => visibleColumns[column.field])}
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