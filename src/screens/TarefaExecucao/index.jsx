import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatForm } from "@/utils/helpers/forms";
import { dateEnToPt, datetimeToPt } from "@/utils/helpers/date";
import { createTarefaExecucao, deleteTarefaExecucao, listTarefaExecucao, updateTarefaExecucao } from "@/services/tarefa/tarefaExecucao";
import { tarefaExecucaoSchema } from "./validations";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetos } from "@/services/projeto/projetos";
import { listTarefas } from "@/services/tarefa/tarefas";

// Configuração dos filtros e colunas
const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'data',
  sortOrder: 'asc',
};

const columnsFields = [
  //{ field: 'nome', label: 'Nome', enabledOrder: true, piper: (field) => !!field ? field : '' },
  { field: 'tarefa_id', label: 'Tarefa' },
  { field: 'colaborador_id', label: 'Colaborador' },
  { field: 'data_inicio_execucao', label: 'Início da Execução', enabledOrder: true, piper: (field) => !!field ? dateEnToPt(field) : '' },
  { field: 'data_fim_execucao', label: 'Fim da Execução', enabledOrder: true, piper: (field) => !!field ? dateEnToPt(field) : '' },
];

const cadastroInitialValue = {
  tarefa_id: '',
  colaborador_id: '',
  data_inicio_execucao: '',
  data_fim_execucao: '',
};

export default function TarefaExecucao() {
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
  } = useTable(columnsFields, listTarefaExecucao, basefilters, (results) => {
    return results.data;
  });


  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Registrar Execução de Tarefa',
      yupSchema: tarefaExecucaoSchema,
      data,
      forms: [
        {
          name: 'colaborador',
          label: 'Colaborador',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listColaboradores,
          required: true,
        },
        {
          name: 'projeto',
          label: 'Projeto',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listProjetos,
          required: true,
        },
        {
          name: 'tarefa',
          label: 'Tarefa',
          type: 'selectAsync',
          loadOptions: listTarefas,
          required: true,
        },
        {
          name: 'data_inicio_execucao',
          label: 'Início da Execução',
          type: 'datetime-local',
          required: true,
        },
        {
          name: 'data_fim_execucao',
          label: 'Fim da Execução',
          type: 'datetime-local',
          required: true,
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then((result) => {
        return formatForm(result).getResult();
      })

      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createTarefaExecucao : updateTarefaExecucao;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success' })
            load()
          })
          .catch(callGlobalAlert)
          .finally(handleGlobalLoading.hide)
      })
      .catch(console.log)
    console.log(data)
  }


  // const handleDelete = async (row) => {
  //   handleGlobalLoading.show();
  //   try {
  //     await deleteTarefaExecucao(row.id);
  //     callGlobalNotify({ message: 'Tarefa excluída com sucesso!', variant: 'success' });
  //     load(); // Atualiza a lista após exclusão
  //   } catch (error) {
  //     callGlobalAlert({ message: 'Erro ao excluir tarefa.', variant: 'danger' });
  //   } finally {
  //     handleGlobalLoading.hide();
  //   }
  // };

  return (
    <Background>
      <HeaderTitle
        title="Execução de Tarefas"
        optionsButtons={[
          {
            label: 'Registrar Execução',
            onClick: () => callModalCadastro(cadastroInitialValue),
            icon: FiPlus,
          },
        ]}
      />
      <Section>
        <Table
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          //searchPlaceholder="Buscar Tarefas"
          searchOffiline
          filtersComponentes={
            <>

            </>
          }
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                callModalCadastro(row);
              },
              icon: FiEdit,
            },
            // {
            //   label: 'Excluir',
            //   onClick: (row) => {
            //     handleDelete(row);
            //   },
            //   icon: FiTrash,
            // },
          ]}

        />
      </Section>
    </Background>
  );
}
