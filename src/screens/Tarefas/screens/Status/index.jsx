import { memo, useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { createTarefaStatus, deleteTarefaStatus, listTarefaStatus, updateTarefaStatus } from "@/services/tarefa/tarefaStatus";
import useTable from "@/utils/hooks/useTable";
import { tarefaStatusSchema } from "./validations";

const basefilters = {
  search: '',
  // perPage: 20,
  // selectedRows: [],
  page: 1,
  // sortedColumn: 'id',
  // sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true },
  { field: 'order', label: 'Ordem', enabledOrder: true },
];

const cadastroInitialValue = {
  nome: '',
  order: null
};

function TarefaStatus() {
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
  } = useTable(columnsFields, listTarefaStatus, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    if(!data.id) {
      data.order = rows.length + 1;
    }
    callGlobalDialog({
      title: 'Novo Status',
      yupSchema: tarefaStatusSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: '',
        },
        {
          name: 'order',
          label: 'Ordem',
          type: 'number',
          placeholder: '',
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createTarefaStatus : updateTarefaStatus;
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
      <HeaderTitle title="Status de Tarefas" optionsButtons={[
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
          searchPlaceholder="Pesquisar Status"
          searchOffiline
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                console.log(row)
                callModalCadastro(row)
              },
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              onClick: (row) =>{
                 handleGlobalLoading.show()
                  deleteTarefaStatus(row.id)
                    .then((result) => {
                      callGlobalNotify({ message: 'Status excluído com sucesso', variant: 'danger'})
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
export default TarefaStatus;