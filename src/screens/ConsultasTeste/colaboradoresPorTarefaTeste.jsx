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
import { useAuth } from "@/utils/context/AuthProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from 'xlsx';

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

    const title = `Colaboradores Por Tarefa - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})`;
    doc.setFontSize(14);
    doc.text(title, 14, 22); 

    const startY = 30; 
    doc.autoTable({
        startY: startY,
        head: [[
            'Projeto', 
            'Tarefa', 
            'Status Tarefa', 
            'Inicio Prog.', 
            'Fim Prog.', 
            'Início Real', 
            'Fim Real',
            'Colaborador(es)',  
            'Situação'
        ]],
        body: data.map(item => ([
            item.projeto_nome || '', 
            item.tarefa_nome || '',
            item.tarefa_status || '',
            item.inicio_programado || '',
            item.fim_programado || '',
            item.inicio_real || '',
            item.fim_real || '',
            item.tarefa_colaborador || '',
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
            textColor: [255, 255, 255], // Texto branco
            fontSize: 6
        },
        margin: { top: startY }
    });

    const fileName = `relatorio_colaboradores_tarefa_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.pdf`;
    doc.save(fileName);
};


const exportToCSV = (data, dataInicio, dataFim) => {
    const csvRows = [];

    const headers = [
        'Projeto', 
        'Tarefa', 
        'Status Tarefa', 
        'Inicio Prog.', 
        'Fim Prog.', 
        'Início Real', 
        'Fim Real',
        'Colaborador(es)',  
        'Situação'
    ];
    csvRows.push(headers.join(','));

    data.forEach(item => {
        const row = [
            item.projeto_nome || '', 
            item.tarefa_nome || '',
            item.tarefa_status || '',
            item.inicio_programado || '',
            item.fim_programado || '',
            item.inicio_real || '',
            item.fim_real || '',
            item.tarefa_colaborador || '',
            item.prazo_label.label || ''
        ];
        csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_colaboradores_tarefa_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

const exportToXLSX = (data, dataInicio, dataFim) => {
    const orderedColumns = [
        { field: 'projeto_nome', header: 'Projeto'},
        { field: 'projeto_status', header: 'Status Projeto'},
        { field: 'projeto_fase', header: 'Fase Projeto'},
        { field: 'projeto_setor', header: 'Setor Projeto'},
        { field: 'tarefa_nome', header: 'Tarefa'},
        { field: 'tarefa_status', header: 'Status Tarefa'},
        { field: 'inicio_programado', header: 'Inicio Programado'},
        { field: 'fim_programado', header: 'Fim Programado'},
        { field: 'inicio_real', header: 'Inicio Real'},
        { field: 'fim_real', header: 'Fim Real'},
        { field: 'tarefa_colaborador', header: 'Colaborador(es)'},
        { field: 'prazo_label', header: 'Situação' }  
    ];

    const formattedData = data.map(item => {
        const orderedData = {};
        orderedColumns.forEach(col => {
            orderedData[col.header] = col.field === 'prazo_label'
                ? item.prazo_label.label || ''
                : item[col.field] || ''; 
        });    console.log(orderedData)

        return orderedData;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    
    const fileName = `relatorio_colaboradores_tarefa_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };



const columnsFields = [
    { field: 'projeto_nome', label: 'Projeto', enabledOrder: true },
    { field: 'projeto_status', label: 'Status Projeto', enabledOrder: true },
    { field: 'projeto_fase', label: 'Fase Projeto', enabledOrder: true },
    { field: 'projeto_setor', label: 'Setor Projeto', enabledOrder: true },
    { field: 'tarefa_nome', label: 'Tarefa', enabledOrder: true },
    { field: 'tarefa_status', label: 'Status Tarefa', enabledOrder: true },
    { field: 'inicio_programado', label: 'Inicio Programado', enabledOrder: true },
    { field: 'fim_programado', label: 'Fim Programado', enabledOrder: true },
    { field: 'inicio_real', label: 'Inicio Real', enabledOrder: true },
    { field: 'fim_real', label: 'Fim Real', enabledOrder: true },
    { field: 'tarefa_colaborador', label: 'Colaborador(es)', enabledOrder: true },
    {
        field: 'prazo', label: 'Situação', enabledOrder: false, piper: (value, row) => {
            const { prazo_label } = row;
            return <TooltipPrazo prazoLabels={prazo_label} />;
        },
    },
];

export default function ConsultaColaboradoresPorTarefaTeste() {
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
                                    // Verifica se fim_execucao é igual a fim_real ou se fim_real está indefinido (N/D)
                                    const prazoLabels = fim_real && fim_real !== "N/D"
                                        ? fim_execucao === fim_real
                                            ? dateDiffWithLabels(fim_programado, fim_real) // Se forem iguais, usa dateDiffWithLabels
                                            : dateExecutionDiffWithLabels(fim_programado, fim_real, fim_real === execucoes[execucoes.length - 1].fim_execucao) // Caso contrário, usa dateExecutionDiffWithLabels
                                        : dateExecutionDiffWithLabels(fim_programado, execucoes[execucoes.length - 1].fim_execucao, true); // Se fim_real for "N/D", mostra "Execução Parcial"

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
                title="Consultar Tarefas dos Projetos por Colaborador"
                optionsButtons={user.nivel_acesso === 2 ? [ 
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
                    }
                ] : []} 
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