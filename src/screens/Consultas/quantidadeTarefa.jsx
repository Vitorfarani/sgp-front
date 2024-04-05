import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetos } from "@/services/projeto/projetos";
import { listTarefasPorAgrupamento } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { DateTest, TooltipTarefas } from "@/components/index";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
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
    { field: 'no_prazo', label: 'Entregues no Prazo', enabledOrder: true },
    { field: 'inicio_fora_periodo', label: 'Iniciadas Fora do Período', enabledOrder: true },
    { field: 'nao_finalizada.dentro_do_prazo', label: 'Não Finalizadas e Dentro do Prazo', enabledOrder: true },
    { field: 'total_prazo', label: 'Total no Prazo', enabledOrder: true },
    { field: 'nao_finalizada.fora_do_prazo.total', label: 'Não Finalizadas e Atrasadas', enabledOrder: true },
    { field: 'atrasado.total', label: 'Entregues Atrasadas', enabledOrder: true },
    { field: 'total_atraso', label: 'Total com Atraso', enabledOrder: true },
    { field: 'atrasado.tarefa', label: 'Tarefas Entregues Atrasadas'},
    { field: 'nao_finalizada.fora_do_prazo.tarefa', label: 'Tarefas Não Entregues e Atrasadas'}
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

        const mappedData = results.map(result => {
            const atrasadoTarefa = result.atrasado ? result.atrasado.tarefa : [];
            const naoFinalizadaForaPrazoTarefa = result.nao_finalizada.fora_do_prazo ? result.nao_finalizada.fora_do_prazo.tarefa : [];

            const hasAtrasado = atrasadoTarefa.length > 0;
            const hasNaoFinalizada = naoFinalizadaForaPrazoTarefa.length > 0;

            const atrasadoTarefaTooltip = (
                <TooltipTarefas tasks={atrasadoTarefa} icon={hasAtrasado ? FaEye : FaRegEyeSlash} type="atrasadoTarefa" />
            );

            const naoFinalizadaForaPrazoTarefaTooltip = (
                <TooltipTarefas tasks={naoFinalizadaForaPrazoTarefa} icon={hasNaoFinalizada ? FaEye : FaRegEyeSlash} type="naoFinalizadaForaPrazoTarefa" />
            );

            return {
                colaborador_nome: result.colaborador,
                no_prazo: result.no_prazo,
                "atrasado.total": result.atrasado ? result.atrasado.total : 0,
                inicio_fora_periodo: result.inicio_fora_periodo,
                "nao_finalizada.dentro_do_prazo": result.nao_finalizada.dentro_do_prazo,
                "nao_finalizada.fora_do_prazo.total": result.nao_finalizada.fora_do_prazo ? result.nao_finalizada.fora_do_prazo.total : 0,
                total_prazo: result.no_prazo + result.inicio_fora_periodo + result.nao_finalizada.dentro_do_prazo,
                total_atraso: (result.atrasado ? result.atrasado.total : 0) + (result.nao_finalizada.fora_do_prazo ? result.nao_finalizada.fora_do_prazo.total : 0),
                "atrasado.tarefa": atrasadoTarefaTooltip,
                "nao_finalizada.fora_do_prazo.tarefa": naoFinalizadaForaPrazoTarefaTooltip
            };
        });
        const sortedData = orderBy(mappedData, [filtersState.sortedColumn], [filtersState.sortOrder]);

        // Retorne os dados ordenados
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
                title="Consultar Quantidade de Tarefas por Colaborador e Agrupamento" />
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
                            <Col md={3}>
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