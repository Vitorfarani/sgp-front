import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { createCliente, deleteCliente, listClientes, updateCliente } from "@/services/clientes";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { clienteSchema } from "./validations";
import InputMask from 'react-input-mask';
import { celularMask } from "@/utils/helpers/mask";

const basefilters = {
  search: '',
  perPage: 20,
  page: 1,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true },
  { field: 'setor', label: 'Setor Interno', enabledOrder: true },
];

const cadastroInitialValue = {
  nome: '',
  setor: '',
};

export default function Clientes() {
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
  } = useTable(columnsFields, listClientes, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Cliente',
      yupSchema: clienteSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: '',
        },
        {
          name: 'setor',
          label: 'Setor interno',
          placeholder: '',
        },

      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createCliente : updateCliente;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success' })
            resetFilters()
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
      <HeaderTitle title="Clientes" optionsButtons={[
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
          searchPlaceholder="Pesquisar Cliente"
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
                    deleteCliente(row.id)
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