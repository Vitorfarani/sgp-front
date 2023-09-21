import { memo, useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { createTarefaClasse, deleteTarefaClasse, listTarefaClasse, updateTarefaClasse } from "@/services/tarefa/tarefaClasse";
import useTable from "@/utils/hooks/useTable";
import { tarefaClasseSchema } from "./validations";

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
];

const cadastroInitialValue = {
  nome: '',
};

function TarefaClasse() {
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
  } = useTable(columnsFields, listTarefaClasse, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Nova Classe',
      yupSchema: tarefaClasseSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: '',
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createTarefaClasse : updateTarefaClasse;
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
      <HeaderTitle title="Classe de Tarefas" optionsButtons={[
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
          searchPlaceholder="Pesquisar Classe"
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
                  deleteTarefaClasse(row.id)
                    .then((result) => {
                      callGlobalNotify({ message: 'Classe excluída com sucesso', variant: 'danger'})
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
export default TarefaClasse;