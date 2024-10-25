import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { Col } from "react-bootstrap";
import { dateDiffWithLabels, dateEnToPtWithHour, dateExecutionDiffWithLabels } from '@/utils/helpers/date';
import { TooltipPrazo } from "@/components/index";
import { DateTest } from "@/components/index";
import orderBy from 'lodash/orderBy';
import { listSetores } from "@/services/setores";
import { listProjetos } from "@/services/projeto/projetos";
import moment from "moment";
import { listColaboradorProjetosTarefatTeste } from "@/services/consultasTeste/consultasteste";
import { useAuth } from "@/utils/context/AuthProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";


const basefilters = {
    search: '',
    perPage: 20,
    selectedRows: [],
    page: 1,
    sortedColumn: 'id',
    colaborador: null,
    sortOrder: 'asc',
};

const exportToPDF = (data, dataInicio, dataFim) => {
    const doc = new jsPDF();

    console.log("data:", data)

    const title = `Tarefa Por Colaborador - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})`;
    doc.setFontSize(14);
    doc.text(title, 14, 22); 
    
    const startY = 30; 
    doc.autoTable({
        startY: startY,
        head: [[
            'Colaborador',
            'Projeto', 
            'Tarefa', 
            'Status Tarefa', 
            'Inicio Prog.', 
            'Fim Prog.', 
            'Início Real', 
            'Fim Real',
            'Situação'
        ]],
        body: data.map(item => ([
            item.colaborador_nome || '', 
            item.projeto_nome || '',
            item.tarefa_nome || '',
            item.tarefa_status || '',
            item.inicio_programado || '',
            item.fim_programado || '',
            item.inicio_real || '',
            item.fim_real || '',
            item.prazo_label.label || ''
        ])),
        theme: 'grid', 
        styles: {
            cellPadding: 3, 
            fontSize: 6,
            halign: 'center' 
        },
        headStyles: {
            fillColor: [52, 84, 143],
            textColor: [255, 255, 255], 
            fontSize: 6
        },
        margin: { top: startY }
    });

    const fileName = `relatorio_tarefa_colaborador_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.pdf`;
    doc.save(fileName);
};

const columnsFields = [
    { field: 'colaborador_nome', label: 'Colaborador', enabledOrder: true },
    { field: 'projeto_nome', label: 'Projeto', enabledOrder: true },
    { field: 'projeto_status', label: 'Status Projeto', enabledOrder: true },
    { field: 'tarefa_nome', label: 'Tarefa', enabledOrder: true },
    { field: 'tarefa_status', label: 'Status Tarefa', enabledOrder: true },
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
export default function ConsultaTarefasPorColaboradorTeste() {
    const { user } = useAuth();
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
    } = useTable(columnsFields, listColaboradorProjetosTarefatTeste, basefilters, (results) => {
        if (!results || Object.keys(results).length === 0) {
            return [];
        }

        const mappedData = [];

        Object.keys(results).forEach(key => {
            const colaboradorData = results[key];
            if (!colaboradorData) return;

            const { colaborador_nome, projetos } = colaboradorData;
            if (!projetos || typeof projetos !== 'object') return;

            Object.keys(projetos).forEach(projetoKey => {
                const projeto = projetos[projetoKey];
                if (!projeto) return;

                const {
                    projeto_nome,
                    projeto_status,
                    projeto_fase,
                    tarefas,
                } = projeto;

                if (!Array.isArray(tarefas) || tarefas.length === 0) return;

                tarefas.forEach(tarefa => {
                    if (!tarefa) return;

                    const {
                        tarefa_nome,
                        inicio_programado,
                        fim_programado,
                        inicio_real,
                        fim_real,
                        tarefa_status,
                        execucoes = [] // Pega o array de execuções ou um array vazio
                    } = tarefa;

                    // Se houver execuções, mapeia cada execução
                    if (execucoes.length > 0) {
                        execucoes.forEach(execucao => {
                            const { inicio_execucao, fim_execucao } = execucao;

                            // Verifica se fim_execucao é igual a fim_real ou se fim_real está indefinido (N/D)
                            const prazoLabels = fim_real && fim_real !== "N/D"
                                ? fim_execucao === fim_real
                                    ? dateDiffWithLabels(fim_programado, fim_real) // Se forem iguais, usa dateDiffWithLabels
                                    : dateExecutionDiffWithLabels(fim_programado, fim_real, fim_real === execucoes[execucoes.length - 1].fim_execucao) // Caso contrário, usa dateExecutionDiffWithLabels
                                : dateExecutionDiffWithLabels(fim_programado, execucoes[execucoes.length - 1].fim_execucao, true); // Se fim_real for "N/D", mostra "Execução Parcial"

                            const inicio_programado_pt = inicio_programado !== "N/D" ? dateEnToPtWithHour(inicio_programado) : inicio_programado;
                            const fim_programado_pt = fim_programado !== "N/D" ? dateEnToPtWithHour(fim_programado) : fim_programado;
                            const inicio_execucao_pt = inicio_execucao !== "N/D" ? dateEnToPtWithHour(inicio_execucao) : inicio_execucao;
                            const fim_execucao_pt = fim_execucao !== "N/D" ? dateEnToPtWithHour(fim_execucao) : fim_execucao;

                            const projeto_status_abreviado = abreviarStatus(projeto_status, "projeto");
                            const tarefa_status_abreviado = abreviarStatus(tarefa_status, "tarefa");

                            mappedData.push({
                                colaborador_nome: colaborador_nome || "",
                                projeto_nome: projeto_nome || "",
                                projeto_status: projeto_status_abreviado || "",
                                projeto_fase: projeto_fase || "",
                                tarefa_nome: tarefa_nome || "",
                                inicio_programado: inicio_programado_pt || "",
                                fim_programado: fim_programado_pt || "",
                                inicio_real: inicio_execucao_pt || "",
                                fim_real: fim_execucao_pt,
                                tarefa_status: tarefa_status_abreviado || "",
                                prazo_label: prazoLabels,
                            });
                        });
                    } else {
                        // Caso não haja execuções, utiliza os dados normais da tarefa
                        const prazoLabels = dateDiffWithLabels(fim_programado, fim_real);
                        const inicio_programado_pt = inicio_programado !== "N/D" ? dateEnToPtWithHour(inicio_programado) : inicio_programado;
                        const fim_programado_pt = fim_programado !== "N/D" ? dateEnToPtWithHour(fim_programado) : fim_programado;
                        const inicio_real_pt = inicio_real !== "N/D" ? dateEnToPtWithHour(inicio_real) : inicio_real;
                        const fim_real_pt = fim_real !== "N/D" ? dateEnToPtWithHour(fim_real) : fim_real;

                        const projeto_status_abreviado = abreviarStatus(projeto_status, "projeto");
                        const tarefa_status_abreviado = abreviarStatus(tarefa_status, "tarefa");

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
                });
            });
        });

        const sortedData = orderBy(mappedData, [filtersState.sortedColumn], [filtersState.sortOrder]);

        return sortedData;
    });



    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        handleChangeFilters('data_inicio', dataInicio)
        handleChangeFilters('data_fim', dataFim)
        load();
    }, [basefilters.search, dataInicio, dataFim]);

    return (
        <Background>
            <HeaderTitle
                title="Consultar Tarefas Por Colaborador"
                optionsButtons={user.nivel_acesso === 2 ? [ // Condicional para exibir o botão apenas se o nível de acesso for 2
                    {
                        label: 'Exportar como PDF',
                        onClick: () => exportToPDF(rows, dataInicio, dataFim), // Pass dataInicio and dataFim
                        icon: FaFilePdf
                    }
                ] : []} // Caso contrário, o array de botões será vazio
            />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    //searchPlaceholder="Consultar Projetos"
                    filtersComponentes={
                        <>
                            {user.nivel_acesso === 2 && (
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
                            )}
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
                            {user.nivel_acesso === 2 && (
                                <Col md={2}>
                                    <SelectAsync
                                        placeholder="Filtrar por Setor"
                                        loadOptions={(search) => listSetores('?search=' + search)}
                                        getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                                        onChange={(setor) => {
                                            handleChangeFilters('setor_id', setor ? setor.id : null);
                                        }}
                                        isClearable
                                    />
                                </Col>
                            )}
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
