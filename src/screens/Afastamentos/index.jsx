import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { createAfastamento, deleteAfastamento, listAfastamentos, updateAfastamento } from "@/services/afastamento/afastamento";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { afastamentoSchema } from "./validations";
import InputMask from 'react-input-mask';
import { celularMask } from "@/utils/helpers/mask";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listAfastamentoTipos } from "@/services/afastamento/afastamentoTipo";
import { formatForm } from "@/utils/helpers/forms";
import { dateEnToPt, datetimeToPt } from "@/utils/helpers/date";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'inicio',
  sortOrder: 'desc',
};

const columnsFields = [
  { field: 'tipo_afastamento', label: 'Tipo de afastamento', enabledOrder: true, piper: (field) => field.nome },
  { field: 'colaborador', label: 'Colaborador', enabledOrder: true, piper: (field) => !!field ? field.nome : '' },
  { field: 'inicio', label: 'Data de Inicio', enabledOrder: true,piper: (field) => !!field ? dateEnToPt(field) : ''},
  { field: 'fim', label: 'Data de fim', enabledOrder: true, piper: (field) => !!field ? dateEnToPt(field) : ''},
];

const cadastroInitialValue = {
  colaborador: null,
  tipo_afastamento: null,
  inicio: '',
  fim: null,
};

export default function Afastamentos() {
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
  } = useTable(columnsFields, listAfastamentos, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Afastamento',
      yupSchema: afastamentoSchema,
      data,
      forms: [
        {
          name: 'tipo_afastamento',
          label: 'Tipo de afastamento',
          type: 'selectAsync',
          loadOptions: listAfastamentoTipos
        },
        {
          name: 'colaborador',
          label: 'Colaborador',
          type: 'selectAsync',
          loadOptions: listColaboradores
        },
        {
          name: 'inicio',
          label: 'Data Inicio',
          type: 'date',
          placeholder: '',
        },
        {
          name: 'fim',
          label: 'Data Fim',
          type: 'date',
          placeholder: '',
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
    .then((result) => {
      return formatForm(result).rebaseIds(['tipo_afastamento', 'colaborador']).getResult()
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createAfastamento : updateAfastamento;
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
      <HeaderTitle title="Afastamentos" optionsButtons={[
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
          searchPlaceholder="Pesquisar Afastamento"
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
                deleteAfastamento(row.id)
                  .then((result) => {
                    callGlobalNotify({ message: result.message, variant: 'danger' })
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