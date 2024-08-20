import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listSetores } from "@/services/setores";
import { listClientes } from "@/services/clientes";
import { listProjetoBySetorCliente } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { FcClearFilters } from "react-icons/fc";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'id',
  cliente: null,
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'projeto', label: 'Projeto', enabledOrder: true },
  { field: 'cliente', label: 'Cliente', enabledOrder: true },
  { field: 'cliente_setor', label: 'Setor do Cliente', enabledOrder: true },
  { field: 'setor', label: 'Setor Responsável', enabledOrder: true }
];

export default function ConsultaProjeto() {

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
        title="Consultar Projetos"/>
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
