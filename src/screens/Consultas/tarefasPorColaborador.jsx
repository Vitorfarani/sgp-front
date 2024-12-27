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
import { useAuth } from "@/utils/context/AuthProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { listColaboradorProjetosTarefa } from "@/services/consultas/consultas";

const basefilters = {
    search: '',
    perPage: 20,
    selectedRows: [],
    page: 1,
    sortedColumn: 'colaborador_nome',
    colaborador: null,
    sortOrder: 'asc',
    setor_id: null,
};

const exportToPDF = (data, dataInicio, dataFim) => {
    const doc = new jsPDF();

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

const exportToCSV = (data, dataInicio, dataFim) => {
    const csvRows = [];

    const headers = [

        'Colaborador',
        'Projeto',
        'Tarefa',
        'Status Tarefa',
        'Inicio Prog.',
        'Fim Prog.',
        'Início Real',
        'Fim Real',
        'Situação'
    ];

    csvRows.push(headers.join(','));


    data.forEach(item => {
        const row = [
            item.colaborador_nome || '',
            item.projeto_nome || '',
            item.tarefa_nome || '',
            item.tarefa_status || '',
            item.inicio_programado || '',
            item.fim_programado || '',
            item.inicio_real || '',
            item.fim_real || '',
            item.prazo_label.label || ''
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    link.download = `relatorio_tarefa_colaborador_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};


const exportToXLSX = (data, dataInicio, dataFim) => {
    const orderedColumns = [
        { field: 'colaborador_nome', header: 'Colaborador' },
        { field: 'projeto_nome', header: 'Projeto' },
        { field: 'projeto_status', header: 'Status Projeto' },
        { field: 'tarefa_nome', header: 'Tarefa' },
        { field: 'tarefa_status', header: 'Status Tarefa' },
        { field: 'inicio_programado', header: 'Início Programado' },
        { field: 'fim_programado', header: 'Fim Programado' },
        { field: 'inicio_real', header: 'Início Real' },
        { field: 'fim_real', header: 'Fim Real' },
        { field: 'prazo_label', header: 'Situação' }
    ];

    const formattedData = data.map(item => {
        const orderedData = {};
        orderedColumns.forEach(col => {
            orderedData[col.header] = col.field === 'prazo_label'
                ? item.prazo_label.label || ''
                : item[col.field] || '';
        }); console.log(orderedData)

        return orderedData;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

    const fileName = `relatorio_tarefa_colaborador_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
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
export default function ConsultaTarefasPorColaborador() {
    const { user } = useAuth();
    const [dataInicio, setDataInicio] = useState(moment().format('YYYY-MM-01'));
    const [dataFim, setDataFim] = useState(moment().format('YYYY-MM-DD'));
    const [projetoFilter, setProjetoFilter] = useState();
    const [setorFilter, setSetorFilter] = useState()
    const [sortedData, setSortedData] = useState([]); // Estado para armazenar mappedData
    const [filterTipoTarefa, setFilterTipoTarefa] = useState('todas'); // 'todas', 'naoIniciadas', 'iniciadas'
    const [finalData, setFinalData] = useState([]);

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
    } = useTable(
        columnsFields,
        listColaboradorProjetosTarefa, basefilters,
        (results) => {
            if (!results || Object.keys(results).length === 0) {
                setFinalData([]);
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

                        let ultimoFimExecucaoPt = null; // Variável para armazenar o último fim_execucao_pt

                        // Se houver execuções, mapeia cada execução
                        if (execucoes.length > 0) {
                            execucoes.forEach(execucao => {
                                const { inicio_execucao, fim_execucao } = execucao;

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

                                ultimoFimExecucaoPt = fim_execucao_pt;

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

                        if (execucoes.length > 0 && fim_real === "N/D") {
                            const inicio_programado_pt = inicio_programado !== "N/D" ? dateEnToPtWithHour(inicio_programado) : inicio_programado;
                            const fim_programado_pt = fim_programado !== "N/D" ? dateEnToPtWithHour(fim_programado) : fim_programado;
                            const inicio_real_pt = execucoes.length >= 1
                                ? ultimoFimExecucaoPt || (inicio_real !== "N/D" ? dateEnToPtWithHour(inicio_real) : inicio_real)
                                : (inicio_real !== "N/D" ? dateEnToPtWithHour(inicio_real) : inicio_real);
                            const fim_real_pt = fim_real === "N/D" ? "N/D" : dateEnToPtWithHour(fim_real);

                            const prazoTotal = fim_real
                                ? dateDiffWithLabels(fim_programado, fim_real)
                                : dateDiffWithLabels(fim_programado, "N/D");

                            mappedData.push({
                                colaborador_nome: colaborador_nome || "",
                                projeto_nome: projeto_nome || "",
                                projeto_status: abreviarStatus(projeto_status, "projeto") || "",
                                projeto_fase: projeto_fase || "",
                                tarefa_nome: tarefa_nome || "",
                                inicio_programado: inicio_programado_pt || "",
                                fim_programado: fim_programado_pt || "",
                                inicio_real: inicio_real_pt,
                                fim_real: fim_real_pt,
                                tarefa_status: abreviarStatus(tarefa_status, "tarefa") || "",
                                prazo_label: prazoTotal,
                            });
                        }
                    });
                });
            });

            // Lógica de filtragem no próprio método de renderização
            let filteredData = [...mappedData];  // Cria uma cópia dos dados originais

            if (filterTipoTarefa === 'naoIniciadas') {
                filteredData = filteredData.filter(task => !task.inicio_real || task.inicio_real === 'N/D');  // Tarefas sem inicio_real
            } else if (filterTipoTarefa === 'iniciadas') {
                filteredData = filteredData.filter(task => task.inicio_real && task.inicio_real !== 'N/D');  // Tarefas com inicio_real
            }

            const sortedData = orderBy(filteredData, [filtersState.sortedColumn], [filtersState.sortOrder]);


            setSortedData(sortedData);
            setFinalData(sortedData);  // Atualiza finalData com os dados filtrados

            return sortedData;
        });

        useEffect(() => {
            handleChangeFilters('search', basefilters.search);
            handleChangeFilters('data_inicio', dataInicio)
            handleChangeFilters('data_fim', dataFim)
        
            load(); // Se load for necessário, isso só será chamado quando finalData for atualizado
        }, [basefilters.search, dataInicio, dataFim, filterTipoTarefa, filtersState.sortedColumn, filtersState.sortOrder]);
        

    return (
        <Background>
            <HeaderTitle
                title="Consultar Tarefas Por Colaborador"
                optionsButtons= { [
                    {
                        label: 'Exportar como PDF',
                        onClick: () => exportToPDF(rows, dataInicio, dataFim),
                        icon: FaFilePdf
                    },
                    {
                        label: 'Exportar como CSV',
                        onClick: () => exportToCSV(rows, dataInicio, dataFim),
                        icon: FaFileCsv
                    },
                    {
                        label: 'Exportar como XLSX',
                        onClick: () => exportToXLSX(rows, dataInicio, dataFim),
                        icon: FaFileExcel
                    },
                    // Botões de filtro
                    {
                        label: 'Todas as Tarefas',
                        onClick: () => {
                            console.log("Alterando filtro para:", 'todas'); // Depuração
                            setFilterTipoTarefa('todas');
                        },
                        className: filterTipoTarefa === 'todas' ? 'active' : ''
                    },
                    {
                        label: 'Tarefas Não Iniciadas',
                        onClick: () => {
                            console.log("Alterando filtro para:", 'naoIniciadas'); // Depuração
                            setFilterTipoTarefa('naoIniciadas')
                        },
                        className: filterTipoTarefa === 'naoIniciadas' ? 'active' : ''
                    },
                    {
                        label: 'Tarefas Iniciadas',
                        onClick: () => {
                            setFilterTipoTarefa('iniciadas'); // Removido o duplicado
                        },
                        className: filterTipoTarefa === 'iniciadas' ? 'active' : ''
                    }
               ]}
            />

            <Section>
                <Table
                    columns={columns}
                    rows={finalData}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    //searchPlaceholder="Consultar Projetos"
                    filtersComponentes={
                        <>
                            {(user.nivel_acesso === 2 || user.nivel_acesso === 5) && (
                                <Col md={2}>
                                    <SelectAsync
                                        placeholder="Filtrar por Colaborador"
                                        loadOptions={(search) => listColaboradores('?search=' + search)}
                                        getOptionLabel={(option) => option.nome}
                                        filterOption={({ data }) => {
                                            if (!projetoFilter) return true

                                            return projetoFilter.projeto_responsavel.some(pr => pr.colaborador_id === data.id)

                                        }}
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
                                    filterOption={({ data }) => {
                                        // Se nenhum setor for selecionado, exibe todos os projetos
                                        if (!setorFilter) return true;

                                        // Verifica se o projeto está associado ao setor selecionado
                                        return data.projeto_setor.some(
                                            (setor) => setor.setor_id === setorFilter.id
                                        );
                                    }}
                                    onChange={(projeto) => {
                                        handleChangeFilters('projeto_id', projeto ? projeto.id : null);
                                        setProjetoFilter(projeto); // Atualiza o filtro de projeto
                                    }}
                                    isClearable
                                />
                            </Col>
                            {(user.nivel_acesso === 2 || user.nivel_acesso === 5) && (
                                <Col md={2}>
                                    <SelectAsync
                                        placeholder="Filtrar por Setor"
                                        loadOptions={(search) => listSetores('?search=' + search)}
                                        getOptionLabel={(option) => `${option.sigla} - ${option.nome}`}
                                        filterOption={
                                            user.nivel_acesso === 2
                                                ? ({ data }) => data.id === user.colaborador.setor_id
                                                : null // Permite todos os setores para nivel_acesso === 5
                                        }
                                        onChange={(setor) => {
                                            handleChangeFilters('setor_id', setor ? setor.id : null);
                                            setSetorFilter(setor); // Atualiza o filtro de setor
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
