import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table, TooltipPrazo } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradorProjetosStatusTarefa} from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { listProjetos } from "@/services/projeto/projetos";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listSetores } from "@/services/setores";
import orderBy from 'lodash/orderBy';
import moment from "moment";


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
        backgroundColor: '#435678',
        color: '#FFFFFF',
        enabledOrder: true,
        colspan: 1,
      },
      {
        field: 'projeto_nome',
        label: 'Projeto',
        backgroundColor: '#5a6d90',
        color: '#FFFFFF',
        enabledOrder: true,
        colspan: 1,
      },
      {
        field: 'Tarefas',
        label: 'Tarefas',
        colspan: 6,
        color: '#FFFFFF',
        backgroundColor: '#18304a',
        subColumns: [
          {
            field: 'Entregues',
            label: 'Entregues',
            colspan: 2,
            color: '#FFFFFF',
            backgroundColor: '#18304a',
            nestedColumns: [
              { field: 'total_entregues_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
              { field: 'total_entregues_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
            ]
          },
          {
            field: 'Em Desenvolvimento',
            label: 'Em Desenvolvimento',
            colspan: 2,
            color: '#FFFFFF',
            backgroundColor: '#18304a',
            nestedColumns: [
              { field: 'total_desenvolvimento_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
              { field: 'total_desenvolvimento_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
            ]
          },
          {
            field: 'Não Iniciada',
            label: 'Não Iniciada',
            colspan: 2,
            color: '#FFFFFF',
            backgroundColor: '#18304a',
            nestedColumns: [
              { field: 'total_nao_iniciadas_prazo', label: 'Prazo', color: 'white', backgroundColor: '#00780e', borderRadius: '10%' },
              { field: 'total_nao_iniciadas_atraso', label: 'Atrasado', color: 'white', backgroundColor: '#a30019', borderRadius: '10%' }
            ]
          },
    ]}
];

export default function ConsultaColaboradorPorProjeto() {
    // const [dataInicio, setDataInicio] = useState(moment().format('YYYY-MM-01'));
    // const [dataFim, setDataFim] = useState(moment().format('YYYY-MM-DD'));
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
    } = useTable(columnsFields, listColaboradorProjetosStatusTarefa, basefilters, (results) => {
        if (!results || Object.keys(results).length === 0) {
            return [];
        }

        const mappedData = [];

        for (const [key, colaboradorData] of Object.entries(results)) {
            const { colaborador_nome, projetos } = colaboradorData || {};

            for (const [projetoKey, projetoData] of Object.entries(projetos)) {
                const {
                    projeto_nome,
                    tarefas_entregues,
                    tarefas_em_desenvolvimento,
                    tarefas_nao_iniciadas,
                } = projetoData || {};

                const {
                    total_prazo: total_entregues_prazo,
                    total_atraso: total_entregues_atraso,
                } = tarefas_entregues || { total_prazo: 0, total_atraso: 0 };

                const {
                    total_prazo: total_desenvolvimento_prazo,
                    total_atraso: total_desenvolvimento_atraso,
                } = tarefas_em_desenvolvimento || { total_prazo: 0, total_atraso: 0 };

                const {
                    total_prazo: total_nao_iniciadas_prazo,
                    total_atraso: total_nao_iniciadas_atraso,
                } = tarefas_nao_iniciadas || { total_prazo: 0, total_atraso: 0 };

                mappedData.push({
                    colaborador_nome: colaborador_nome || "",
                    projeto_nome: projeto_nome || "",
                    total_entregues_prazo: total_entregues_prazo || 0,
                    total_entregues_atraso: total_entregues_atraso || 0,
                    total_desenvolvimento_prazo: total_desenvolvimento_prazo || 0,
                    total_desenvolvimento_atraso: total_desenvolvimento_atraso || 0,
                    total_nao_iniciadas_prazo: total_nao_iniciadas_prazo || 0,
                    total_nao_iniciadas_atraso: total_nao_iniciadas_atraso || 0,
                });
            }
        }

        const totais = {
            colaborador_nome: 'TOTAL',
            projeto_nome: '',

            total_entregues_prazo: 0,
            total_entregues_atraso: 0,
            total_desenvolvimento_prazo: 0,
            total_desenvolvimento_atraso: 0,
            total_nao_iniciadas_prazo: 0,
            total_nao_iniciadas_atraso: 0,
        };

        mappedData.forEach(item => {
            for (let key in totais) {
              if (key !== 'colaborador_id' && key !== 'colaborador_nome' && key !== 'projeto_id' && key !== 'projeto_nome' ) {
                totais[key] += item[key];
              }
            }
          });
      
          mappedData.push(totais);

        const sortedData = orderBy(mappedData, [filtersState.sortedColumn], [filtersState.sortOrder]);

        return sortedData;
    });

    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        // handleChangeFilters('data_inicio', dataInicio)
        // handleChangeFilters('data_fim', dataFim)
        load();
    }, [basefilters.search]);

    return (
        <Background>
            <HeaderTitle
                title="Consultar Colaborador Por Projeto" />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    filtersComponentes={
                        <>
                            <Col md={2} >
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
                            <Col md={2} >
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
                            <Col md={2} >
                                <SelectAsync
                                    placeholder="Filtrar por Setor"
                                    loadOptions={(search) => listSetores('?search=' + search)}
                                    getOptionLabel={(option) => option.nome}
                                    onChange={(setor) => {
                                        handleChangeFilters('setor_id', setor ? setor.id : null);
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