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
import { listConsultaConhecimentoByColaborador } from "@/services/consultas/consultas";
import {listConhecimentoNivels} from "@/services/conhecimento/conhecimentoNivel";
import { listConhecimentos } from "@/services/conhecimento/conhecimentos";

import { Col } from "react-bootstrap";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  setor: null,
  page: 1,
  active: true,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true, style: { width: 100 }},
  { field: 'conhecimento', label: 'Conhecimento', enabledOrder: false},
  { field: 'nivel', label: 'Nivel', enabledOrder: false},
  { field: 'email', label: 'Email', enabledOrder: false},
  { field: 'telefone', label: 'Telefone', enabledOrder: false, piper: (field) => field && celularMask(field)},
  { field: 'setor', label: 'Setor', enabledOrder: false, piper: (field) => !!field ? field.sigla : '' },  
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
  } = useTable(columnsFields, listConsultaConhecimentoByColaborador, basefilters, (results) => {
    return results.data
  });


  useEffect(() => {
    load();
  }, []);

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
          filtersComponentes={
            <>
            <Col md={3}>
            <SelectAsync
              placeholder="Filtrar por Conhecimento"
              loadOptions={(search) => listConhecimentos('?search='+search)}
              
              getOptionLabel={(option) => option.nome}

              onChange={(conhecimento) => handleChangeFilters('conhecimento', conhecimento.id)} />
            </Col>
            <Col md={3}>
            <SelectAsync
              placeholder="Filtrar por Nivel"
              loadOptions={(search) => listConhecimentoNivels('?search='+search)}
              // getOptionLabel={(option) => option.sigla}
              getOptionLabel={(option) => option.grau}

              onChange={(nivel) => handleChangeFilters('nivel', nivel.id)} />
            </Col>
            </>

          }
          handleFilters={handleChangeFilters}>
        </Table>
      </Section>
    </Background>
  );
}

