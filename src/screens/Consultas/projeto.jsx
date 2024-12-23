import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listSetores } from "@/services/setores";
import { listClientes } from "@/services/clientes";
import { listProjetoBySetorCliente } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { FcClearFilters } from "react-icons/fc";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { useAuth } from "@/utils/context/AuthProvider";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'projeto',
  cliente: null,
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'projeto', label: 'Projeto', enabledOrder: true },
  { field: 'cliente', label: 'Cliente', enabledOrder: true },
  { field: 'cliente_setor', label: 'Setor do Cliente', enabledOrder: true },
  { field: 'setor', label: 'Setor Responsável', enabledOrder: true }
];


const exportToPDF = (data) => {
  const doc = new jsPDF();
  const title = 'Relatório de Projetos';
  
  doc.setFontSize(14);
  doc.text(title, 14, 22);

  const startY = 30;
  doc.autoTable({
    startY: startY,
    head: [[
      'Projeto',
      'Cliente',
      'Setor do Cliente',
      'Setor Responsável',
    ]],
    body: data.map(item => ([
      item.projeto || '',
      item.cliente || '',
      item.cliente_setor || '',
      item.setor || '',
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

  doc.save('relatorio_projetos.pdf');
};

const exportToCSV = (data) => {
  const csvContent = [
    ["Projeto", "Cliente", "Setor do Cliente", "Setor Responsável"],
    ...data.map(item => [
      item.projeto,
      item.cliente,
      item.cliente_setor,
      item.setor
    ])
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "relatorio_projetos.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToXLSX = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projetos");

  XLSX.writeFile(workbook, "relatorio_projetos.xlsx");
};

export default function ConsultaProjeto() {
  const { user } = useAuth();

  const {
    rows,
    columns,
    load,
    filtersState,
    isTableLoading,
    handleChangeFilters,
    resetFilters,
    isEmpty,
  } = useTable(columnsFields, listProjetoBySetorCliente, basefilters, (results) => {
    if (!results || Object.keys(results).length === 0) {
      return [];
    }
  
    const mappedData = [];

    for (const [key, projeto] of Object.entries(results)) {
      const { projeto: nomeProjeto, cliente, cliente_setor, setores } = projeto || {};
    
      if (setores && setores.length > 0) {
        const setoresSiglas = setores.map(setor => setor.sigla).join(', ');
    
        mappedData.push({
          projeto: nomeProjeto || '',
          cliente: cliente || '',
          cliente_setor: cliente_setor || '',
          setor: setoresSiglas || '',
        });
      }
    }
    
  
    let filteredData = [...mappedData];
  
    if (filtersState.setor || filtersState.cliente) {
      filteredData = filteredData.filter((data) => {
        return (
          (filtersState.setor ? data.setor.includes(filtersState.setor) : true) &&
          (filtersState.cliente ? data.cliente.includes(filtersState.cliente) : true)
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
  
    // Aplicando a filtragem da pesquisa diretamente no sortedData
    sortedData = sortedData.filter((item) =>
      item.projeto.toLowerCase().includes(filtersState.search.toLowerCase())
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
        title="Consultar Projetos"
        optionsButtons={user.nivel_acesso >= 2 ? [ 
          {
              label: 'Exportar como PDF',
              onClick: () => exportToPDF(rows),
              icon: FaFilePdf
          },
          {
              label: 'Exportar como CSV',
              onClick: () => exportToCSV(rows),
              icon: FaFileCsv
          },
          {
              label: 'Exportar como XLSX',
              onClick: () => exportToXLSX(rows),
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
          searchPlaceholder="Consultar Projetos"
          filtersComponentes={
            <>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Cliente"
                  loadOptions={(search) => listClientes('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(cliente) => {
                    handleChangeFilters('cliente_id', cliente ? cliente.id : "");
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                  onChange={(setor) => {
                    handleChangeFilters('setor_id', setor ? setor.id : "");
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
