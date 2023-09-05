import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { createSetor, deleteSetor, listSetores, updateSetor } from "@/services/setores";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { setorSchema } from "./validations";
import { listSimpleSetores } from "@/services/setores";
import { listSimpleColaboradores } from "@/services/colaboradores";

const basefilters = {
  // search: '',
  // perPage: 20,
  // selectedRows: [],
  // gerencia: null,
  // page: 1,
  // sortedColumn: 'id',
  // sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', order: true, style: { width: 300 } },
  { field: 'sigla', label: 'Sigla', order: true },
  { field: 'responsavel_list', label: 'Responsável', enabledOrder: true, piper: (field) => !!field && field.nome },
  { field: 'setor_list', label: 'Subordinação', enabledOrder: true, piper: (field) => !!field && field.nome },
];

const cadastroInitialValue = {
  nome: '',
  sigla: '',
  responsavel_list: '',
  setor_list: '',
};

export default function Setor() {
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
  } = useTable(columnsFields, listSetores, basefilters, (results) => {
    return results
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Setor',
      yupSchema: setorSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: '',
        },
        {
          name: 'sigla',
          label: 'Sigla',
          placeholder: '',
        },
        {
          name: 'responsavel_list',
          label: 'Responsável',
          type: 'selectAsync',
          loadOptions: listSimpleColaboradores
        },
        {
          name: 'setor_list',
          label: 'Subordinação',
          type: 'selectAsync',
          loadOptions: listSimpleSetores
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createSetor : updateSetor;
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
      <HeaderTitle title="Setor" optionsButtons={[
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
          searchPlaceholder="Pesquisar Setor"
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
            {
              label: 'Excluir',
              onClick: (row) =>{
                handleGlobalLoading.show()
                deleteSetor(row.id)
                  .then((result) => {
                    callGlobalAlert({title: 'Sucesso', message: 'Setor excluido com sucesso', color: 'green'})
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