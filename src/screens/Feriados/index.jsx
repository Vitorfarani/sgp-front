import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatForm } from "@/utils/helpers/forms";
import { dateEnToPt, datetimeToPt } from "@/utils/helpers/date";
import moment from "moment";
import { createFeriado, deleteFeriado, listFeriados, updateFeriado } from "@/services/feriados";
import { feriadoSchema } from "./validations";

const basefilters = {
  search: moment().year(),
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'data',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'data', label: 'Data', enabledOrder: true, piper: (field) => !!field ? dateEnToPt(field) : '' },
  { field: 'nome', label: 'Nome', enabledOrder: true, piper: (field) => !!field ? field : '' },
  { field: 'tipo', label: 'Tipo', enabledOrder: true, piper: (field) => !!field ? (field === 'feriado' ? 'Feriado' : 'Ponto facultativo') : '' }
];

const cadastroInitialValue = {
  nome: '',
  data: moment().format('YYYY-MM-DD'),
  tipo: 'feriado'
};

export default function Feriados() {
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
  } = useTable(columnsFields, listFeriados, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Feriado ou Ponto facultativo',
      yupSchema: feriadoSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          type: 'text'
        },
        {
          name: 'data',
          label: 'Data',
          type: 'date'
        },
        {
          name: 'tipo',
          label: 'Tipo',
          type: 'select',
          options: [
            { value: 'feriado', label: 'Feriado' }, 
            { value: 'ponto_facultativo', label: 'Ponto Facultativo' }
          ]
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
    .then((result) => {
      return formatForm(result).getResult()
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createFeriado : updateFeriado;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success' })
            load()
          })
          .catch(callGlobalAlert)
          .finally(handleGlobalLoading.hide)
      })
      .catch(console.log)

  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Background>
      <HeaderTitle title="Feriados" optionsButtons={[
        {
          label: 'Cadastrar',
          onClick: () => callModalCadastro(cadastroInitialValue),
          icon: FiPlus,
        },
      ]} />
      <Section>
        <Table
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          searchPlaceholder="Ano"
          searchOffiline
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                callModalCadastro(row)
              },
              icon: FiEdit,
            },
            ...user.id !== 1 || (user.nivel_acesso >= 2 && user.id !== 1)
            ? [
            {
              label: 'Excluir',
              onClick: (row) => {
                handleGlobalLoading.show()
                deleteFeriado(row.id)
                  .then((result) => {
                    callGlobalNotify({ message: result.message, variant: 'danger' })
                    load()
                  })
                  .catch(callGlobalAlert)
                  .finally(handleGlobalLoading.hide)
              },
              icon: FiTrash,
            },
          ] : []
          ]}>
        </Table>
      </Section>
    </Background>
  );
}