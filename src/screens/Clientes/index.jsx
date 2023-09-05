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

const basefilters = {
  // search: '',
  // perPage: 20,
  // selectedRows: [],
  // setor: null,
  // page: 1,
  // sortedColumn: 'id',
  // sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', order: true, style: { width: 300 } },
  { field: 'email', label: 'Email', order: true },
  { field: 'telefone', label: 'Telefone', order: true },
  { field: 'responsavel', label: 'Responsável', order: true },
];

const cadastroInitialValue = {
  nome: '',
  email: '',
  telefone: '',
  responsavel: '',
};

export default function Clientes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert } = useTheme();

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
          name: 'email',
          label: 'Email',
          placeholder: '',
        },
        {
          name: 'telefone',
          label: 'Telefone',
          placeholder: '',
          as: InputMask,
          maskChar: null,
          mask: '(99)99999-9999'
        },
        {
          name: 'responsavel',
          label: 'Responsável',
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
            callGlobalAlert({ title: '', message: res.mensagem, color: 'green', icon: FiCheckCircle, timer: 2000 })
            load()
            resetFilters()
          })
          .catch((erro) => {
            callGlobalAlert(erro)

          })
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
                // handleGlobalLoading.show()
                // showCliente(row.cliente_id)
                //   .then((result) => {
                //     return formatForm(result).rebaseIdsToObj(['classe_id', 'cliente_nivel'])
                //   })
                //   .then((result) => {
                //   })
                //   .catch(callGlobalAlert)
                //   .finally(handleGlobalLoading.hide)
              },
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              onClick: (row) =>{
                 handleGlobalLoading.show()
                  deleteCliente(row.id)
                    .then((result) => {
                      callGlobalAlert({title: 'Sucesso', message: 'Cliente excluida com sucesso', color: 'green'})
                    })
                    .catch(callGlobalAlert)
                    .finally(handleGlobalLoading.hide)
              },
              icon: FiTrash,
            },
          ]}>
        </Table>
      </Section>
    </Background>
  );
}