import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatForm } from "@/utils/helpers/forms";
import {dateEnToPtWithHour, datetimeToPt } from "@/utils/helpers/date";
import { createTarefaExecucao, deleteTarefaExecucao, listColaboradorTarefaPorExecucao, listProjetosColaborador, listTarefaExecucao, listTarefasColaborador, updateTarefaExecucao } from "@/services/tarefa/tarefaExecucao";
import { tarefaExecucaoSchema } from "./validations";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listTarefas } from "@/services/tarefa/tarefas";
import orderBy from 'lodash/orderBy';
import { Col } from "react-bootstrap";
import moment from "moment";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'data',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'colaborador_nome', label: 'Colaborador', enabledOrder: true },
  { field: 'tarefa_nome', label: 'Tarefa', enabledOrder: true },
  { field: 'data_inicio_execucao', label: 'Início da Execução', enabledOrder: true },
  { field: 'data_fim_execucao', label: 'Fim da Execução', enabledOrder: true },
];

const cadastroInitialValue = {
  tarefa_id: '',
  colaborador_id: '',
  data_inicio_execucao: '',
  data_fim_execucao: '',
};

export default function TarefaExecucao() {

  const [dataInicio, setDataInicio] = useState(moment().format('YYYY-MM-01'));
  const [dataFim, setDataFim] = useState(moment().format('YYYY-MM-DD'));

  const navigate = useNavigate();
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const userAccessLevel = user?.nivel_acesso; // Obtém o nível de acesso do usuário


  const {
    rows,
    columns,
    load,
    filtersState,
    isTableLoading,
    handleChangeFilters,
    resetFilters,
    isEmpty,
  } = useTable(columnsFields,
    // Modifique aqui a função que carrega as tarefas
    async (filters) => {
      if (userAccessLevel === 1) {
        // Usuário com nível de acesso 1
        const colaboradorId = user.colaborador_id; // ID do colaborador do usuário
        return await listColaboradorTarefaPorExecucao({ colaboradorId, ...filters });
      } else {
        // Usuário com nível de acesso 2
        return await listColaboradorTarefaPorExecucao(filters);
      }
    },
    basefilters,
    (results) => {
      if (!results || Object.keys(results).length === 0) {
        return [];
      }

      const mappedData = [];

      for (const [colaboradorId, colaboradorData] of Object.entries(results)) {
        const {
          colaborador_nome,
          tarefas = []
        } = colaboradorData || {};

        for (const tarefa of tarefas) {
          const inicio_execucao_pt = tarefa.data_inicio_execucao
            ? dateEnToPtWithHour(tarefa.data_inicio_execucao)
            : "N/D";

          const fim_execucao_pt = tarefa.data_fim_execucao
            ? dateEnToPtWithHour(tarefa.data_fim_execucao)
            : "N/D";

          mappedData.push({
            colaborador_id: colaboradorId,
            colaborador_nome: colaborador_nome || "",
            tarefa_id: tarefa.tarefa_id || 0,
            tarefa_nome: tarefa.tarefa_nome || "",
            execucao_id: tarefa.execucao_id || 0,
            data_inicio_execucao: inicio_execucao_pt,
            data_fim_execucao: fim_execucao_pt
          });
        }
      }

      const sortedData = orderBy(mappedData, [filtersState.sortedColumn], [filtersState.sortOrder]);

      return sortedData;

    });



  function callModalCadastro(data = {}) {
    // Define diretamente o ID do colaborador
    const colaboradorId = 39;
    const colaboradorNome = "Wesley Braga de Faria";

    //const { id: colaboradorId, nome: colaboradorNome } = user?.colaborador || {};

    const initialData = {
      colaborador: colaboradorId ? { id: colaboradorId, nome: colaboradorNome } : null,
      ...data,
    };

    console.log('listTarefas:', listTarefas);

    callGlobalDialog({
      title: 'Registrar Execução de Tarefa',
      yupSchema: tarefaExecucaoSchema,
      data: initialData,
      forms: [
        {
          name: 'colaborador',
          label: 'Colaborador',
          type: 'selectAsync',
          loadOptions: listColaboradores,
          required: true,
          formatOptionLabel: option => `${option.nome}`,
        },
        {
          name: 'projeto',
          label: 'Projeto',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: async () => {
            // Define diretamente o ID do colaborador
            const colaboradorSelecionado = colaboradorId;

            if (colaboradorSelecionado) {
              try {
                // Obtém as tarefas do colaborador
                const tarefas = await listTarefasColaborador();

                const tarefasFiltradas = tarefas.filter(tarefa =>
                  tarefa.tarefa_colaborador.some(tc => tc.colaborador_id === colaboradorSelecionado) &&
                  tarefa.data_fim_real === null
                );

                // Obtém IDs dos projetos das tarefas filtradas
                const projetosIds = [...new Set(tarefasFiltradas.map(tarefa => tarefa.projeto_id))];

                if (projetosIds.length > 0) {
                  const todosProjetos = await listProjetosColaborador();
                  const projetosFiltradosPorId = todosProjetos.filter(projeto => projetosIds.includes(projeto.id));

                  return projetosFiltradosPorId;
                } else {
                  return [];
                }
              } catch (error) {
                console.error('Error fetching projetos:', error);
                return [];
              }
            }
            return [];
          },
          required: true,
          formatOptionLabel: option => `${option.nome}`, 
        },
        {
          name: 'tarefa',
          label: 'Tarefa',
          type: 'selectAsync',
          loadOptions: async (inputValue, formValues) => {
            // Use diretamente o ID do colaborador
            const colaboradorSelecionado = colaboradorId;

            if (colaboradorSelecionado) {
              try {
                const tarefas = await listTarefasColaborador();

                const tarefasFiltradas = tarefas.filter(tarefa =>
                  tarefa.tarefa_colaborador.some(tc => tc.colaborador_id === colaboradorSelecionado) &&
                  tarefa.data_fim_real === null
                );
                return tarefasFiltradas;
              } catch (error) {
                console.error('Error fetching tarefas:', error);
                return [];
              }
            }
            return [];
          },
          required: true,
          formatOptionLabel: option => `${option.nome}`,
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
        const formattedResult = formatForm(result).rebaseIds(['projeto', 'colaborador', 'tarefa']).getResult();
        console.log('Resultado formatado:', formattedResult);

        if (formattedResult.execucao_id) {
          formattedResult.id = formattedResult.execucao_id;
          delete formattedResult.execucao_id;
        }

        return formattedResult;
      })
      .then(async (result) => {
        handleGlobalLoading.show();

        const method = result.id ? updateTarefaExecucao : createTarefaExecucao;

        try {
          const res = await method(result);
          callGlobalNotify({ message: res.message, variant: 'success' });
          load();
        } catch (error) {
          const errorMessage = `Erro: ${error.message}`;
          const additionalMessage = "Por favor, verifique os dados e tente novamente.";

          callGlobalAlert({
            message: `${errorMessage} ${additionalMessage}`,
            variant: 'danger'
          });
        } finally {
          handleGlobalLoading.hide();
        }
      })
      .catch(console.log);
  }

  useEffect(() => {
    handleChangeFilters('search', basefilters.search);

    handleChangeFilters('data_inicio', dataInicio)
    handleChangeFilters('data_fim', dataFim)

    load();
  }, []);

  // const handleDelete = async (row) => {
  //   handleGlobalLoading.show();
  //   try {
  //     await deleteTarefaExecucao(row.id);
  //     callGlobalNotify({ message: 'Execução excluída com sucesso!', variant: 'success' });
  //     load();
  //   } catch (error) {
  //     callGlobalAlert({ message: 'Erro ao excluir execução.', variant: 'danger' });
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
          // filtersComponentes={
          //   <>
          //     <Col md={2} >
          //       <SelectAsync
          //         placeholder="Filtrar por Colaborador"
          //         loadOptions={(search) => listColaboradores('?search=' + search)}
          //         getOptionLabel={(option) => option.nome}
          //         onChange={(colaborador) => {
          //           handleChangeFilters('colaborador_id', colaborador ? colaborador.id : null);
          //         }}
          //         isClearable
          //       />
          //     </Col>
          //     <Col md={2}>
          //       <DateTest
          //         id="dataFim"
          //         value={dataFim}
          //         label="Fim:"
          //         onChange={(date) => {
          //           setDataFim(date);
          //           handleChangeFilters('data_fim', date);
          //         }}
          //       />
          //     </Col>
          //     <Col md={2}>
          //       <DateTest
          //         id="dataInicio"
          //         value={dataInicio}
          //         label="Início:"
          //         onChange={(date) => {
          //           setDataInicio(date);
          //           handleChangeFilters('data_inicio', date);
          //         }}
          //       />
          //     </Col>
          //   </>
          // }
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
