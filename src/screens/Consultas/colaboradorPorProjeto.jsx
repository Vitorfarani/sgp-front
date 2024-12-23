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
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useAuth } from "@/utils/context/AuthProvider";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

const basefilters = {
    search: '',
    perPage: 20,
    //selectedRows: [],
    page: 1,
    sortedColumn: 'colaborador_nome',
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


const exportToPDF = (data, dataInicio, dataFim) => {
    const doc = new jsPDF();
    const title = `Colaborador por Projeto - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})`;
    
    doc.setFontSize(14);
    doc.text(title, 14, 22);
  
    const startY = 30;
  
    const head = [
      [
        { content: 'Colaborador', rowSpan: 3, styles: { fillColor: '#435678', textColor: '#FFFFFF' } },
        { content: 'Projeto', rowSpan: 3, styles: { fillColor: '#5a6d90', textColor: '#FFFFFF' } },
        { content: 'Tarefas', colSpan: 6, styles: { fillColor: '#18304a', textColor: '#FFFFFF' } }
      ],
      [
        { content: 'Entregues', colSpan: 2, styles: { fillColor: '#18304a', textColor: '#FFFFFF' } },
        { content: 'Em Desenvolvimento', colSpan: 2, styles: { fillColor: '#18304a', textColor: '#FFFFFF' } },
        { content: 'Não Iniciada', colSpan: 2, styles: { fillColor: '#18304a', textColor: '#FFFFFF' } }
      ],
      [
        { content: 'Prazo', styles: { fillColor: '#00780e', textColor: 'white', cellPadding: 3, fontSize: 8 } },
        { content: 'Atrasado', styles: { fillColor: '#a30019', textColor: 'white', cellPadding: 3, fontSize: 8 } },
        { content: 'Prazo', styles: { fillColor: '#00780e', textColor: 'white', cellPadding: 3, fontSize: 8 } },
        { content: 'Atrasado', styles: { fillColor: '#a30019', textColor: 'white', cellPadding: 3, fontSize: 8 } },
        { content: 'Prazo', styles: { fillColor: '#00780e', textColor: 'white', cellPadding: 3, fontSize: 8 } },
        { content: 'Atrasado', styles: { fillColor: '#a30019', textColor: 'white', cellPadding: 3, fontSize: 8 } }
      ]
    ];
  
    const body = data.map(item => [
      item.colaborador_nome || '',
      item.projeto_nome || '',
      item.total_entregues_prazo || 0,
      item.total_entregues_atraso || 0,
      item.total_desenvolvimento_prazo || 0,
      item.total_desenvolvimento_atraso || 0,
      item.total_nao_iniciadas_prazo || 0,
      item.total_nao_iniciadas_atraso || 0,
    ]);
  

    doc.autoTable({
      startY: startY,
      head: head,
      body: body,
      theme: 'grid',
      styles: { fontSize: 7, halign: 'center' },
      headStyles: { fillColor: [52, 84, 143], textColor: [255, 255, 255], fontSize: 6 },
      margin: { top: startY },
    });
  
    const fileName = `relatorio_colaborador_por_projeto_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.pdf`;
    doc.save(fileName);
  };

  const exportToCSV = (data, dataInicio, dataFim) => {
    // Título do relatório
    const title = `Colaborador por Projeto - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})\n`;
    
    // Cabeçalhos com subcolunas em formato CSV
    const headers = [
      ['Colaborador', 'Projeto', 'Entregues', '', 'Em Desenvolvimento', '', 'Não Iniciada', ''],
      ['', '', 'Prazo', 'Atrasado', 'Prazo', 'Atrasado', 'Prazo', 'Atrasado']
    ];
    
    // Mapeia os dados para as colunas
    const body = data.map(item => [
      item.colaborador_nome || '',
      item.projeto_nome || '',
      item.total_entregues_prazo || 0,
      item.total_entregues_atraso || 0,
      item.total_desenvolvimento_prazo || 0,
      item.total_desenvolvimento_atraso || 0,
      item.total_nao_iniciadas_prazo || 0,
      item.total_nao_iniciadas_atraso || 0,
    ]);
  
    // Converte os cabeçalhos e dados para o formato CSV
    let csvContent = title;
    csvContent += headers.map(row => row.join(',')).join('\n') + '\n';
    csvContent += body.map(row => row.join(',')).join('\n');
    
    // Cria o blob e inicia o download do arquivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const fileName = `relatorio_colaborador_por_projeto_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.csv`;
    
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  

  const exportToXLSX = (data, dataInicio, dataFim) => {

    const title = `Colaborador por Projeto - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})`;
    

    const headers = [
      ['Colaborador', 'Projeto', 'Entregues', '', 'Em Desenvolvimento', '', 'Não Iniciada', ''],
      ['', '', 'Prazo', 'Atrasado', 'Prazo', 'Atrasado', 'Prazo', 'Atrasado']
    ];
    
    const body = data.map(item => [
      item.colaborador_nome || '',
      item.projeto_nome || '',
      item.total_entregues_prazo || 0,
      item.total_entregues_atraso || 0,
      item.total_desenvolvimento_prazo || 0,
      item.total_desenvolvimento_atraso || 0,
      item.total_nao_iniciadas_prazo || 0,
      item.total_nao_iniciadas_atraso || 0,
    ]);
    

    const worksheetData = [
      [title],      
      ...headers,   
      ...body        
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },  
      { s: { r: 1, c: 2 }, e: { r: 1, c: 3 } },  
      { s: { r: 1, c: 4 }, e: { r: 1, c: 5 } },  
      { s: { r: 1, c: 6 }, e: { r: 1, c: 7 } }   
    ];
  
    // Cria o workbook e adiciona a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
  
    // Gera o arquivo e baixa
    const fileName = `relatorio_colaborador_por_projeto_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  
  
  

export default function ConsultaColaboradorPorProjeto() {
    const [dataInicio, setDataInicio] = useState(moment().format('YYYY-MM-01'));
    const [dataFim, setDataFim] = useState(moment().format('YYYY-MM-DD'));
    const { user } = useAuth();
    // const [dataInicio, setDataInicio] = useState('');
    // const [dataFim, setDataFim] = useState('');
    const [projetoFilter, setProjetoFilter] = useState()
    const [setorFilter, setSetorFilter] = useState()

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

          const sortedData = orderBy(
            mappedData.filter(item => item.colaborador_nome !== 'TOTAL'), 
            [filtersState.sortedColumn], 
            [filtersState.sortOrder]
        );
        
        sortedData.push(mappedData.find(item => item.colaborador_nome === 'TOTAL'));
        
        return sortedData;
    });

    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        handleChangeFilters('data_inicio', dataInicio)
        handleChangeFilters('data_fim', dataFim)
        load();
    }, [basefilters.search]);

    return (
        <Background>
            <HeaderTitle
                title="Consultar Colaborador Por Projeto"
                optionsButtons={[ 
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
                ]} 
                     />
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