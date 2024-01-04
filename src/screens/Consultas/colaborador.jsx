import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { standartResponseApiError } from "@/services/index";
import { celularMask } from "@/utils/helpers/mask";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listConhecimentoByColaborador } from "@/services/consultas/consultas";
import {listConhecimentoNivels} from "@/services/conhecimento/conhecimentoNivel";
import { listConhecimentos } from "@/services/conhecimento/conhecimentos";
import { listColaboradorConhecimento } from "@/services/colaborador/colaboradorConhecimento";
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
  { field: 'colaborador', label: 'Colaborador', enabledOrder: true, style: { width: 100 }},
  { field: 'nome', label: 'Conhecimento', enabledOrder: false},
  { field: 'grau', label: 'Nivel', enabledOrder: false},
];

export default function ConsultarColaborador() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();

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
    // Verifique se results é um objeto antes de fazer a conversão para array
    if (typeof results !== 'object' || results === null) {
      console.error('Os resultados recebidos não são um objeto:', results);
      return [];
    }
  
    const mappedData = [];
  
    // Transforme os resultados em uma lista única de colaboradores com seus conhecimentos
    for (const colaborador of Object.values(results)) {
      for (const conhecimento of colaborador.conhecimento) {
        mappedData.push({
          colaborador: colaborador.colaborador,
          nome: conhecimento.nome,
          grau: conhecimento.grau,
        });
      }
    }
  
    // Filtre os dados com base no valor da pesquisa
    const filteredData = mappedData.filter((item) =>
      item.colaborador.toLowerCase().includes(filtersState.search.toLowerCase())
    );
  
    return filteredData;
  });
  
  useEffect(() => {
    // Atualize a função de filtro ao alterar o valor de pesquisa
    handleChangeFilters('search', basefilters.search);
    load();
  }, [basefilters.search]);

  
  return (
    <Background>
      <HeaderTitle title="Consultar Colaboradores"/>
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
              loadOptions={(search) => listConhecimentoNivels('?search='+search)}
              getOptionLabel={(option) => option.grau}

              onChange={(nivel) => handleChangeFilters('conhecimento_nivel_id', nivel.id)} />
            </Col>
            <Col md={3}>
            <SelectAsync
              placeholder="Filtrar por Conhecimento"
              loadOptions={(search) => listConhecimentos('?search='+search)}
              
              getOptionLabel={(option) => option.nome}

              onChange={(conhecimento) => handleChangeFilters('conhecimento_id', conhecimento.id)} />
            </Col>
            </>

          }
          handleFilters={handleChangeFilters}>
            
        </Table>
      </Section>
    </Background>
  );
}

