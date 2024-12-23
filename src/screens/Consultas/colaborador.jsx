import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { FcClearFilters } from "react-icons/fc";
import { listConhecimentoByColaborador } from "@/services/consultas/consultas";
import { listConhecimentoNivels } from "@/services/conhecimento/conhecimentoNivel";
import { listConhecimentos } from "@/services/conhecimento/conhecimentos";
import { listSetores } from "@/services/setores";
import { Col } from "react-bootstrap";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "@/utils/context/AuthProvider";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from 'xlsx';

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  setor: null,
  page: 1,
  sortedColumn: 'colaborador',
  sortOrder: 'asc',
};


const exportToPDF = (data, filteredKnowledge) => {
  const doc = new jsPDF();
  
  const title = `Conhecimento por Colaborador - Relatório${filteredKnowledge ? `: ${filteredKnowledge}` : ''}`;
  doc.setFontSize(14);
  doc.text(title, 14, 22);

  const startY = 30;
  doc.autoTable({
    startY: startY,
    head: [[
      'Colaborador',
      'Conhecimento',
      'Nível',
      'Setor',
    ]],
    body: data.map(item => ([
      item.colaborador || '',
      item.nome || '',
      item.grau || '',
      item.sigla || '',
    ])),
    theme: 'grid',
    styles: {
      cellPadding: 3,
      fontSize: 7,
      halign: 'center'
    },
    headStyles: {
      fillColor: [52, 84, 143],
      textColor: [255, 255, 255],
      fontSize: 6
    },
    margin: { top: startY }
  });

  const fileName = `relatorio_conhecimento_colaborador${filteredKnowledge ? `_${filteredKnowledge}` : ''}.pdf`;
  doc.save(fileName);
};



const exportToCSV = (data, filteredKnowledge) => {

    const orderedColumns = [
        { field: 'colaborador', label: 'Colaborador' },
        { field: 'nome', label: 'Conhecimento' },
        { field: 'grau', label: 'Nivel' },
        { field: 'sigla', label: 'Setor' },
    ];


    const csvData = data.map(item => {
        const orderedItem = {};
        orderedColumns.forEach(col => {
            orderedItem[col.label] = item[col.field] || ''; 
        });
        return orderedItem;
    });


    const csvContent = [
        orderedColumns.map(col => col.label).join(','), // Cabeçalhos
        ...csvData.map(row => orderedColumns.map(col => row[col.label]).join(',')) // Dados
    ].join('\n');


    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = `relatorio_conhecimento_colaborador${filteredKnowledge ? `_${filteredKnowledge}` : ''}.csv`;
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};

const exportToXLSX = (data, filteredKnowledge) => {

    const orderedColumns = [
        { field: 'colaborador', label: 'Colaborador' },
        { field: 'nome', label: 'Conhecimento' },
        { field: 'grau', label: 'Nivel' },
        { field: 'sigla', label: 'Setor' },
    ];


    const xlsxData = data.map(item => {
        const orderedItem = {};
        orderedColumns.forEach(col => {
            orderedItem[col.label] = item[col.field] || ''; 
        });
        return orderedItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Conhecimento');

    const fileName = `relatorio_conhecimento_colaborador${filteredKnowledge ? `_${filteredKnowledge}` : ''}.xlsx`;
    XLSX.writeFile(workbook, fileName);
};



const columnsFields = [
  { field: 'colaborador', label: 'Colaborador', enabledOrder: true, style: { width: 100 } },
  { field: 'nome', label: 'Conhecimento', enabledOrder: true },
  { field: 'grau', label: 'Nivel', enabledOrder: true },
  { field: 'sigla', label: 'Setor', enabledOrder: true },
];

export default function ConsultarColaborador() {

  const { user } = useAuth();
  const [filteredKnowledge, setFilteredKnowledge] = useState(null); // Estado para o conhecimento filtrado

  const {
    rows,
    columns,
    load,
    filtersState,
    isTableLoading,
    handleChangeFilters,
    resetFilters,
    isEmpty,
  } = useTable(columnsFields, listConhecimentoByColaborador, basefilters, (results) => {
    if (!results || Object.keys(results).length === 0) {
      return [];
    }

    const mappedData = [];

    for (const [id, colaborador] of Object.entries(results)) {
      for (const conhecimento of colaborador.conhecimento) {
        const setorSigla = colaborador.setor ? colaborador.setor.sigla : '';

        mappedData.push({
          colaborador: colaborador.colaborador,
          nome: conhecimento.nome,
          grau: conhecimento.grau,
          sigla: setorSigla,
        });
      }
    }
    let sortedData = [...mappedData];

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
      item.colaborador.toLowerCase().includes(filtersState.search.toLowerCase())
    );

    return sortedData
  });


  useEffect(() => {

    handleChangeFilters('search', basefilters.search);
    load();
  }, [basefilters.search]);

  return (
    <Background>
      <HeaderTitle
        title="Consultar Colaboradores"
        optionsButtons={user.nivel_acesso >= 2 ? [
          {
            label: 'Exportar como PDF',
            onClick: () => exportToPDF(rows, filteredKnowledge), 
            icon: FaFilePdf
          },
          {
            label: 'Exportar como CSV',
            onClick: () => exportToCSV(rows, filteredKnowledge),
            icon: FaFileCsv
        },
        {
            label: 'Exportar como XLSX',
            onClick: () => exportToXLSX(rows, filteredKnowledge),
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
          //searchPlaceholder="Consultar Colaborador"
          searchOffiline
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
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Nivel"
                  loadOptions={(search) => listConhecimentoNivels('?search=' + search)}
                  getOptionLabel={(option) => option.grau}
                  onChange={(nivel) => {
                    handleChangeFilters('conhecimento_nivel_id', nivel ? nivel.id : "");
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Conhecimento"
                  loadOptions={(search) => listConhecimentos('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(conhecimento) => {
                    handleChangeFilters('conhecimento_id', conhecimento ? conhecimento.id : "");
                    setFilteredKnowledge(conhecimento ? conhecimento.nome : null); // Atualiza o estado com o nome do conhecimento filtrado
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  getOptionLabel={(option) => option.sigla}
                  onChange={(setor) => {
                    handleChangeFilters('setor_id', setor ? setor.id : "");
                  }}
                  isClearable
                />
              </Col>

            </>

          }
          handleFilters={handleChangeFilters}>

        </Table>
      </Section>
    </Background>
  );
}

