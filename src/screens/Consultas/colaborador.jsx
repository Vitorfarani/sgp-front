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

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  setor: null,
  page: 1,
  sortedColumn: 'id',
  sortOrder: 'asc',
};


const columnsFields = [
  { field: 'colaborador', label: 'Colaborador', enabledOrder: true, style: { width: 100 } },
  { field: 'nome', label: 'Conhecimento', enabledOrder: true },
  { field: 'grau', label: 'Nivel', enabledOrder: true },
  { field: 'sigla', label: 'Setor', enabledOrder: true },

];

export default function ConsultarColaborador() {
  const [selectedConhecimento, setSelectedConhecimento] = useState(null);
  const [selectedNivel, setSelectedNivel] = useState(null);
  const [selectedSetor, setSelectedSetor] = useState(null);

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
        mappedData.push({
          colaborador: colaborador.colaborador,
          nome: conhecimento.nome,
          grau: conhecimento.grau,
          sigla: colaborador.setor?.sigla || '',
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


  const handleResetFilters = () => {
    handleChangeFilters('conhecimento_nivel_id', '');
    handleChangeFilters('conhecimento_id', '');
    handleChangeFilters('setor_id', '');
    handleChangeFilters('search', basefilters.search);
    setSelectedConhecimento(null);
    setSelectedNivel(null);
    setSelectedSetor(null);
  };

  return (
    <Background>
      <HeaderTitle
        title="Consultar Colaboradores"
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
          searchPlaceholder="Consultar Colaborador"
          searchOffiline
          filtersComponentes={
            <>
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Nivel"
                  loadOptions={(search) => listConhecimentoNivels('?search=' + search)}
                  getOptionLabel={(option) => option.grau}
                  onChange={(nivel) => {
                    setSelectedNivel(nivel);
                    handleChangeFilters('conhecimento_nivel_id', nivel.id);
                  }}
                  value={selectedNivel || ''}
                />
              </Col>
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Conhecimento"
                  loadOptions={(search) => listConhecimentos('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(conhecimento) => {
                    setSelectedConhecimento(conhecimento);
                    handleChangeFilters('conhecimento_id', conhecimento.id);
                  }}
                  value={selectedConhecimento || ''}
                />
              </Col>
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  getOptionLabel={(option) => option.sigla}
                  onChange={(setor) => {
                    setSelectedSetor(setor);
                    handleChangeFilters('setor_id', setor.id);
                  }}
                  value={selectedSetor || ''}
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

