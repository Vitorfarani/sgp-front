import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listColaboradorProjetosTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { dateDiffWithLabels, dateEnToPtWithHour } from '@/utils/helpers/date';
import { TooltipPrazo } from "@/components/index";
import { DateTest } from "@/components/index";
import orderBy from 'lodash/orderBy';
import { listSetores } from "@/services/setores";
import { listProjetos } from "@/services/projeto/projetos";

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
    { field: 'colaborador_nome', label: 'Colaborador', enabledOrder: true },
    { field: 'projeto_nome', label: 'Projeto', enabledOrder: true },
    { field: 'projeto_status', label: 'Status do Projeto', enabledOrder: true },
    { field: 'tarefa_nome', label: 'Tarefa', enabledOrder: true },
    { field: 'tarefa_status', label: 'Status da Tarefa', enabledOrder: true},
    { field: 'inicio_programado', label: 'Início Programado', enabledOrder: true },
    { field: 'fim_programado', label: 'Fim Programado', enabledOrder: true },
    { field: 'inicio_real', label: 'Início Real', enabledOrder: true },
    { field: 'fim_real', label: 'Fim Real', enabledOrder: true },
    {
        field: 'prazo', label: 'Situação', enabledOrder: false, piper: (value, row) => {
            const { prazo_label } = row;
            return <TooltipPrazo prazoLabels={prazo_label} />;
        },
    },
];
export default function ConsultaTarefasPorColaborador() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const abreviarStatus = (status, tipo) => {
        const mapeamentoStatus = {
            projeto: {
                'Em Desenvolvimento': 'ED',
                'Em Homologação': 'EH',
                'Em Produção': 'PR',
                'Em Negociação': 'EN',
                'Suspenso': 'SP',
                'Sustentação': 'ST',
                'Cancelado': 'CC'
            },
            tarefa: {
                'Em Desenvolvimento': 'ED',
                'Em Homologação': 'EH',
                'Em Produção': 'PR',
                'Em Negociação': 'EN',
                'Suspensa': 'SP',
                'Sustentação': 'ST',
                'Cancelada': 'CC'
            },
        };


        return mapeamentoStatus[tipo][status] || status;
    };
    const {
        rows,
        columns,
        load,
        filtersState,
        isTableLoading,
        handleChangeFilters,
        resetFilters,
        isEmpty,
    } = useTable(columnsFields, listColaboradorProjetosTarefa, basefilters, (results) => {
        if (!results || Object.keys(results).length === 0) {
            return [];
        }

        const mappedData = [];
        for (const [key, colaboradorData] of Object.entries(results)) {
            const { colaborador_nome, projetos } = colaboradorData || {};

            for (const [projetoKey, projeto] of Object.entries(projetos)) {
                const {
                    projeto_nome,
                    projeto_status,
                    projeto_fase,
                    tarefas,
                } = projeto || {};



                for (const tarefa of tarefas) {
                    const {
                        tarefa_nome,
                        inicio_programado,
                        fim_programado,
                        inicio_real,
                        fim_real,
                        tarefa_status,
                    } = tarefa || {};

                    const prazoLabels = dateDiffWithLabels(fim_programado, fim_real);
                    const inicio_programado_pt = inicio_programado !== "N/D" ? dateEnToPtWithHour(inicio_programado) : inicio_programado;
                    const fim_programado_pt = fim_programado !== "N/D" ? dateEnToPtWithHour(fim_programado) : fim_programado;
                    const inicio_real_pt = inicio_real !== "N/D" ? dateEnToPtWithHour(inicio_real) : inicio_real;
                    const fim_real_pt = fim_real !== "N/D" ? dateEnToPtWithHour(fim_real) : fim_real;


                    const projeto_status_abreviado = abreviarStatus(projeto_status, "projeto")
                    const tarefa_status_abreviado = abreviarStatus(tarefa_status, "projeto")

                    mappedData.push({
                        colaborador_nome: colaborador_nome || "",
                        projeto_nome: projeto_nome || "",
                        projeto_status: projeto_status_abreviado || "",
                        projeto_fase: projeto_fase || "",
                        tarefa_nome: tarefa_nome || "",
                        inicio_programado: inicio_programado_pt || "",
                        fim_programado: fim_programado_pt || "",
                        inicio_real: inicio_real_pt || "",
                        fim_real: fim_real_pt,
                        tarefa_status: tarefa_status_abreviado || "",
                        prazo_label: prazoLabels,
                    });


                }
            }
        }

        const sortedData = orderBy(mappedData, [filtersState.sortedColumn], [filtersState.sortOrder]);

        return sortedData;

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
                title="Consultar Tarefas Por Colaborador" />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    //searchPlaceholder="Consultar Projetos"
                    filtersComponentes={
                        <>
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
