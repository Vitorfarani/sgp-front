import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { createContato, deleteContato, listContatos, updateContato } from "@/services/contato";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { contatoSchema } from "./validations";
import InputMask from 'react-input-mask';
import { celularMask } from "@/utils/helpers/mask";
import { listClientes } from "@/services/clientes";
import { formatForm } from "@/utils/helpers/forms";
import { Col } from "react-bootstrap";

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
  { field: 'nome', label: 'Nome', enabledOrder: true},
  { field: 'email', label: 'Email', enabledOrder: true },
  { field: 'telefone', label: 'Telefone', enabledOrder: true, piper: (field) => !!field ? celularMask(field) : 'aa' },
  { field: 'cliente', label: 'Cliente', enabledOrder: true, piper: (field) => !!field ? field.nome : '' },
];

const cadastroInitialValue = {
  nome: '',
  email: '',
  telefone: '',
  cliente: '',
};

export default function Contatos() {
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
  } = useTable(columnsFields, listContatos, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Contato',
      yupSchema: contatoSchema,
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
          name: 'cliente',
          label: 'Cliente',
          type: 'selectAsync',
          loadOptions: listClientes
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
    .then((result) => {
      return formatForm(result).rebaseIds(['cliente']).getResult()
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createContato : updateContato;
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
      <HeaderTitle title="Contatos" optionsButtons={[
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
          searchPlaceholder="Pesquisar Contato"
          filtersComponentes={
            <>
            <Col md={3}>
            <SelectAsync
              placeholder="Cliente"
              loadOptions={(search) => listClientes('?search='+search)}
              onChange={(cliente) => handleChangeFilters('cliente', cliente.id)} />
            </Col>
            </>
          }
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                callModalCadastro(row)
              },
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              onClick: (row) => {
                handleGlobalLoading.show()
                deleteContato(row.id)
                  .then((result) => {
                    callGlobalNotify({ message: result.message, variant: 'danger' })
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