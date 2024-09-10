import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatForm } from "@/utils/helpers/forms";
import { datetimeToPt } from "@/utils/helpers/date";
import moment from "moment";
import { createTarefaExecucao, deleteTarefaExecucao, listTarefaExecucao } from "@/services/tarefa/tarefaExecucao";
import { tarefaExecucaoSchema } from "./validations";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetos } from "@/services/projeto/projetos";
import { listSetores } from "@/services/setores";
import { Col } from "react-bootstrap";
import { listTarefaColaborador } from "@/services/tarefa/tarefaColaborador";
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
  { field: 'nome', label: 'Nome', enabledOrder: true, piper: (field) => !!field ? field : '' },
  { field: 'data_inicio_execucao', label: 'Início da Execução', enabledOrder: true, piper: (field) => !!field ? datetimeToPt(field) : '' },
  { field: 'data_fim_execucao', label: 'Fim da Execução', enabledOrder: true, piper: (field) => !!field ? datetimeToPt(field) : '' },
];

const cadastroInitialValue = {
  tarefa_id: '',
  colaborador_id: '',
  data_inicio_execucao: '',
  data_fim_execucao: '',
};

const formattedResult = formatForm(result).getResult();
formattedResult.tarefa_id = Number(formattedResult.tarefa_id); // Assegure-se de que seja um número

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


  function callModalCadastro(data) {
    callGlobalDialog({
      title: 'Registrar Execução de Tarefa',
      yupSchema: tarefaExecucaoSchema,
      data,
      forms: [
        user.nivel_acesso > 1 && {
          name: 'colaborador',
          label: 'Colaborador',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: listColaboradores,
        },
        user.nivel_acesso > 1 && {
          name: 'tarefa_id',
          label: 'Tarefa',
          type: 'selectAsync',
          loadOptions: listTarefas,
          required: true,
        },
        user.nivel_acesso > 1 && {
          name: 'data_inicio_execucao',
          label: 'Início da Execução',
          type: 'datetime-local',
          required: true,
        },
        user.nivel_acesso > 1 && {
          name: 'data_fim_execucao',
          label: 'Fim da Execução',
          type: 'datetime-local',
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
        handleGlobalLoading.show();
        try {
          // Converter tarefa_id para inteiro se necessário
          const payload = { ...result, tarefa_id: Number(result.tarefa_id) };
          await createTarefaExecucao(payload);
          callGlobalNotify({ message: 'Execução registrada com sucesso!', variant: 'success' });
          load(); // Atualiza a lista de tarefas
        } catch (error) {
          callGlobalAlert({ message: 'Erro ao registrar execução.', variant: 'danger' });
        } finally {
          handleGlobalLoading.hide();
        }
      })
      
      .catch(console.log);
  }

  const handleDelete = async (row) => {
    handleGlobalLoading.show();
    try {
      await deleteTarefaExecucao(row.id);
      callGlobalNotify({ message: 'Tarefa excluída com sucesso!', variant: 'success' });
      load(); // Atualiza a lista após exclusão
    } catch (error) {
      callGlobalAlert({ message: 'Erro ao excluir tarefa.', variant: 'danger' });
    } finally {
      handleGlobalLoading.hide();
    }
  };

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
            {
              label: 'Excluir',
              onClick: (row) => {
                handleDelete(row);
              },
              icon: FiTrash,
            },
          ]}

        />
      </Section>
    </Background>
  );
}
