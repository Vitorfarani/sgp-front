import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table, TooltipPrazo } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetoColaboradoresTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { FcClearFilters } from "react-icons/fc";
import { listProjetos } from "@/services/projeto/projetos";
import { dateDiffWithLabels, dateEnToPtWithHour, dateExecutionDiffWithLabels } from "@/utils/helpers/date";
import orderBy from 'lodash/orderBy';
import { listSetores } from "@/services/setores";
import moment from "moment";
import { listProjetoColaboradoresTarefaTeste } from "@/services/consultasTeste/consultasteste";

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
    { field: 'projeto_nome', label: 'Projeto', enabledOrder: true },
    { field: 'projeto_status', label: 'Status do Projeto', enabledOrder: true },
    { field: 'projeto_fase', label: 'Fase do Projeto', enabledOrder: true },
    { field: 'projeto_setor', label: 'Setor do Projeto', enabledOrder: true },
    { field: 'tarefa_nome', label: 'Tarefa', enabledOrder: true },
    { field: 'tarefa_status', label: 'Status da Tarefa', enabledOrder: true },
    { field: 'inicio_programado', label: 'Inicio Programado', enabledOrder: true },
    { field: 'fim_programado', label: 'Término Programado', enabledOrder: true },
    { field: 'inicio_real', label: 'Inicio Real', enabledOrder: true },
    { field: 'fim_real', label: 'Término Real', enabledOrder: true },
    { field: 'tarefa_colaborador', label: 'Colaborador(es) da Tarefa', enabledOrder: true },
    {
        field: 'prazo', label: 'Situação', enabledOrder: false, piper: (value, row) => {
            const { prazo_label } = row;
            return <TooltipPrazo prazoLabels={prazo_label} />;
        },
    },
];

export default function ConsultaColaboradoresPorTarefaTeste() {
    const [dataInicio, setDataInicio] = useState(moment().format('YYYY-MM-01'));
    const [dataFim, setDataFim] = useState(moment().format('YYYY-MM-DD'));

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
    } = useTable(columnsFields, listProjetoColaboradoresTarefaTeste, basefilters, (results) => {

        const mappedData = [];

        Object.keys(results).forEach((key) => {
            const projetoData = results[key];
            if (projetoData && Array.isArray(projetoData.projeto)) {
                projetoData.projeto.forEach((projeto) => {
                    const { projeto_nome, projeto_status, projeto_fase, projeto_setor, tarefas } = projeto;

                    if (tarefas && Array.isArray(tarefas)) {
                        tarefas.forEach((tarefa) => {
                            const {
                                tarefa_nome,
                                inicio_programado,
                                fim_programado,
                                inicio_real,
                                fim_real,
                                tarefa_status,
                                tarefa_colaborador,
                                execucoes // Adicionado execucoes
                            } = tarefa;

                            // Verifica se fim_execucao é igual a fim_real
                            // const prazoLabels = fim_execucao === fim_real
                            //     ? dateDiffWithLabels(fim_programado, fim_real) // Se forem iguais, usa dateDiffWithLabels
                            //     : dateExecutionDiffWithLabels(fim_programado, fim_real, fim_real === execucoes[execucoes.length - 1].fim_execucao); // Caso contrário, usa dateExecutionDiffWithLabels

                            const inicio_programado_pt = inicio_programado !== "N/D" ? dateEnToPtWithHour(inicio_programado) : inicio_programado;
                            const fim_programado_pt = fim_programado !== "N/D" ? dateEnToPtWithHour(fim_programado) : fim_programado;

                            const projeto_status_abreviado = abreviarStatus(projeto_status, 'projeto');
                            const tarefa_status_abreviado = abreviarStatus(tarefa_status, 'tarefa');

                            const projeto_setor_abreviado = abreviarSetor(projeto_setor);

                            if (execucoes && Array.isArray(execucoes) && execucoes.length > 0) {
                                // Se houver execuções, mapear cada execução
                                execucoes.forEach((execucao) => {
                                    const { inicio_execucao, fim_execucao } = execucao;
                                    const prazoLabels = fim_execucao === fim_real
                                    ? dateDiffWithLabels(fim_programado, fim_real) // Se forem iguais, usa dateDiffWithLabels
                                    : dateExecutionDiffWithLabels(fim_programado, fim_real, fim_real === execucoes[execucoes.length - 1].fim_execucao); // Caso contrário, usa dateExecutionDiffWithLabels
    

                                    mappedData.push({
                                        projeto_nome,
                                        projeto_status: projeto_status_abreviado,
                                        projeto_fase,
                                        projeto_setor: projeto_setor_abreviado.join(', '),
                                        tarefa_nome: tarefa_nome || '',
                                        inicio_programado: inicio_programado_pt || '',
                                        fim_programado: fim_programado_pt || '',
                                        inicio_real: dateEnToPtWithHour(inicio_execucao) || '', // Usando inicio_execucao
                                        fim_real: dateEnToPtWithHour(fim_execucao) || '', // Usando fim_execucao
                                        tarefa_status: tarefa_status_abreviado || '',
                                        tarefa_colaborador: Array.isArray(tarefa_colaborador)
                                            ? tarefa_colaborador.join(', ')
                                            : '',
                                        prazo_label: prazoLabels,
                                    });
                                });
                            } else {
                                const prazoLabels = dateDiffWithLabels(fim_programado, fim_real);

                                // Se não houver execuções, mapear tarefa normalmente
                                mappedData.push({
                                    projeto_nome,
                                    projeto_status: projeto_status_abreviado,
                                    projeto_fase,
                                    projeto_setor: projeto_setor_abreviado.join(', '),
                                    tarefa_nome: tarefa_nome || '',
                                    inicio_programado: inicio_programado_pt || '',
                                    fim_programado: fim_programado_pt || '',
                                    inicio_real: inicio_real !== "N/D" ? dateEnToPtWithHour(inicio_real) : inicio_real,
                                    fim_real: fim_real !== "N/D" ? dateEnToPtWithHour(fim_real) : fim_real,
                                    tarefa_status: tarefa_status_abreviado || '',
                                    tarefa_colaborador: Array.isArray(tarefa_colaborador)
                                        ? tarefa_colaborador.join(', ')
                                        : '',
                                    prazo_label: prazoLabels,
                                });
                            }
                        });
                    }
                });
            }
        });

        const sortedData = orderBy(mappedData, [filtersState.sortedColumn], [filtersState.sortOrder]);

        return sortedData;
    });



    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        handleChangeFilters('data_inicio', dataInicio)
        handleChangeFilters('data_fim', dataFim)
        load();
        // if (dataInicio && dataFim) {
        //     handleChangeFilters('data_inicio', dataInicio);
        //     handleChangeFilters('data_fim', dataFim);
        // } else if (!dataInicio && !dataFim) {
        //     handleChangeFilters('data_inicio', null);
        //     handleChangeFilters('data_fim', null);
        // }
    }, [basefilters.search, dataInicio, dataFim]);

    return (
        <Background>
            <HeaderTitle
                title="Consultar Tarefas dos Projetos por Colaborador" />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    //searchPlaceholder="Consultar Projetos"
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
                                    getOptionLabel={(option) => option.sigla + " - " + option.nome}
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