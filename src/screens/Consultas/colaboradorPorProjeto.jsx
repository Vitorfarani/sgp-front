import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table, TooltipPrazo } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradorProjetosTarefa, listProjetoColaboradoresTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { listProjetos } from "@/services/projeto/projetos";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { dateDiffWithLabels, dateEnToPtWithHour } from "@/utils/helpers/date";
import orderBy from 'lodash/orderBy';

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
    { field: 'projeto_nome', label: 'Projeto(s)', enabledOrder: true },
    {
        field: 'prazo', label: 'Situação no(s) projeto(s)', enabledOrder: false, piper: (value, row) => {
            const { prazo_label } = row;
            return <TooltipPrazo prazoLabels={prazo_label} />;
        },
    },
];

export default function ConsultaColaboradorPorProjeto() {
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

    const abreviarSetor = (setorArray) => {
        const palavrasSignificativas = ['de', 'e', 'do', 'da', 'dos', 'das'];

        return setorArray.map((setor) => {
            const palavras = setor.split(' ');
            const abreviatura = palavras
                .filter((palavra) => !palavrasSignificativas.includes(palavra.toLowerCase()))
                .map((palavra) => palavra.charAt(0))
                .join('');
            return abreviatura.toUpperCase();
        });
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
                            <Col md={3} >
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
                            <Col md={3} >
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
                        </>
                    }
                    handleFilters={handleChangeFilters}
                />
            </Section>
        </Background>
    );
}