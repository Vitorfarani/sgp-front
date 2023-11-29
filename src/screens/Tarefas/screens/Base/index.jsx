import { memo, useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { createTarefaBase, deleteTarefaBase, listTarefaBase, updateTarefaBase } from "@/services/tarefa/tarefaBase";
import useTable from "@/utils/hooks/useTable";
import { tarefaBaseSchema } from "./validations";
import { listTarefaClasse } from "@/services/tarefa/tarefaClasse";
import { formatForm } from "@/utils/helpers/forms";

const basefilters = {
  search: '',
  perPage: 20,
  // selectedRows: [],
  page: 1,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true },
  { field: 'tempo', label: 'Tempo', enabledOrder: true },
  { field: 'tarefa_base_classe', label: 'Classe de Tarefa', enabledOrder: true, piper: (field) => !!field ?  field.nome : '' },
];

const cadastroInitialValue = {
  nome: '',
  tarefa_base_classe_id: null
};

function TarefaBase() {
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
  } = useTable(columnsFields, listTarefaBase, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Base',
      yupSchema: tarefaBaseSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: '',
        },
        {
          name: 'tempo',
          label: 'Tempo',
          type: 'number',
          placeholder: '',
        },
        {
          name: 'tarefa_base_classe',
          label: 'Tarefa Classe',
          type: 'selectAsync',
          loadOptions: listTarefaClasse
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
    .then((result) => {
      return formatForm(result).rebaseIds(['tarefa_base_classe']).trimTextInputs().getResult()
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createTarefaBase : updateTarefaBase;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success'})
            resetFilters()
          })
          .catch((erro) => {
            callGlobalAlert(erro)

          })
          .finally(handleGlobalLoading.hide)
      })

  }
  useEffect(() => {
    load();
  }, []);

  return (
    <Background>
      <HeaderTitle title="Base de Tarefas" optionsButtons={[
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
          searchPlaceholder="Pesquisar Base"
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
                  deleteTarefaBase(row.id)
                    .then((result) => {
                      callGlobalNotify({ message: 'Base excluída com sucesso', variant: 'danger'})
                      load()
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
export default TarefaBase;