import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listColaboradorProjetosTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { FcClearFilters } from "react-icons/fc";
import { dateDiffWithLabels, dateEnToPtWithHour } from '@/utils/helpers/date';
import { TooltipPrazo } from "@/components/index";


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
    { field: 'tarefa_status', label: 'Status da Tarefa' },
    { field: 'inicio_programado', label: 'Início Programado' },
    { field: 'fim_programado', label: 'Fim Programado' },
    { field: 'inicio_real', label: 'Início Real' },
    { field: 'fim_real', label: 'Fim Real' },
    {
        field: 'prazo', label: 'Situação', enabledOrder: false, piper: (value, row) => {
            const { prazo_label } = row;
            return <TooltipPrazo prazoLabels={prazo_label} />;
        },
    },
];
export default function ConsultaTarefasPorColaborador() {


    const abreviarStatus = (status, tipo) => {
        const mapeamentoStatus = {
            projeto: {
                'Em Desenvolvimento': 'ED',
                'Em Homologação': 'EH',
                'Em Produção': 'PR',
                'Em Negociação': 'EN',
                'Suspensa': 'SP',
                'Sustentação': 'ST'
            },
            tarefa: {
                'Em Desenvolvimento': 'ED',
                'Em Homologação': 'EH',
                'Em Produção': 'PR',
                'Em Negociação': 'EN',
                'Suspensa': 'SP',
                'Sustentação': 'ST'
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

        let filteredData = [...mappedData];

        if (filtersState.colaborador) {
            filteredData = filteredData.filter((data) => {
                return (
                    (filtersState.colaborador ? data.colaborador_nome.includes(filtersState.colaborador_nome) : true)
                );
            });
        }

        let sortedData = [...filteredData];

        if (
            filtersState.sortedColumn &&
            filtersState.sortOrder &&
            sortedData.length > 0 &&
            sortedData[0][filtersState.sortedColumn]
        ) {
            sortedData = sortedData.sort((a, b) => {
                const fieldA = a[filtersState.sortedColumn];
                const fieldB = b[filtersState.sortedColumn];

                if (filtersState.sortOrder === 'asc') {
                    return fieldA.localeCompare(fieldB);
                } else {
                    return fieldB.localeCompare(fieldA);
                }
            });
        }

        sortedData = sortedData.filter((item) =>
            item.projeto_nome.toLowerCase().includes(filtersState.search.toLowerCase())
        );

        return sortedData;
    });

    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        load();
    }, [basefilters.search]);



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
                    searchPlaceholder="Consultar Projetos"
                    filtersComponentes={
                        <>
                            <Col md={3}>
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

                        </>
                    }
                    handleFilters={handleChangeFilters}

                />
            </Section>
        </Background>
    );
}
