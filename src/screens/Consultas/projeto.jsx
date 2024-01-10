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
  const [selectedSetor, setSelectedSetor] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

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
        setores.forEach((setor) => {
          mappedData.push({
            projeto: nomeProjeto || '',
            cliente: cliente || '',
            cliente_setor: cliente_setor || '',
            setor: setor[0] || '',
          });
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
  
  const handleResetFilters = () => {
    
    handleChangeFilters('cliente_id', '');
    handleChangeFilters('setor_id', '');
    handleChangeFilters('search', basefilters.search);
    setSelectedCliente(null);
    setSelectedSetor(null);
  };
  

  return (
    <Background>
      <HeaderTitle
        title="Consultar Projetos"
        optionsButtons={[
          {
            label: 'Limpar filtro(s)',
            icon: FcClearFilters,
            onClick: handleResetFilters,
          },
        ]}
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
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                  onChange={(setor) => {
                    setSelectedSetor(setor);
                    handleChangeFilters('setor_id', setor.id);
                  }}
                  value={selectedSetor || ''}
                />
              </Col>
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Cliente"
                  loadOptions={(search) => listClientes('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(cliente) => {
                    setSelectedCliente(cliente);
                    handleChangeFilters('cliente_id', cliente.id);
                  }}
                  value={selectedCliente || ''}
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
