import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { formatForm } from "@/utils/helpers/forms";
import { dateEnToPtWithHour, datetimeToPt } from "@/utils/helpers/date";
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
  const userAccessLevel = user?.nivel_acesso;


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
    listColaboradorTarefaPorExecucao,
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



  function callModalCadastro(data = {}, tarefa) {
    const { id: colaboradorId, nome: colaboradorNome } = user?.colaborador || {};

    const initialData = {
      colaborador: colaboradorId ? { id: colaboradorId, nome: colaboradorNome } : null,
      finalizar_tarefa: false,
      ...data,
    };

    console.log("Data:", data)

    // Tentando capturar o ID corretamente
    const tarefaEditadaId = data?.tarefa_id || data?.id || null;

    // Exibir o ID da tarefa para verificar se está sendo capturado corretamente
    console.log("Tarefa sendo editada (ID):", tarefaEditadaId);



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
          isDisabled: true, // Adiciona esta linha para desativar o campo
        },
        {
          name: 'projeto',
          label: 'Projeto',
          type: 'selectAsync',
          isClearable: true,
          loadOptions: async () => {
            const colaboradorSelecionado = colaboradorId;

            if (colaboradorSelecionado) {
              try {
                const tarefas = await listTarefasColaborador();
                const tarefasFiltradas = tarefas.filter(tarefa =>
                  tarefa.tarefa_colaborador.some(tc => tc.colaborador_id === colaboradorSelecionado) &&
                  tarefa.data_fim_real === null && tarefa.data_inicio_real != null
                );

                const projetosIds = [...new Set(tarefasFiltradas.map(tarefa => tarefa.projeto_id))];

                // Adiciona a tarefa sendo editada, se estiver definida
                if (tarefaEditadaId) {
                  const tarefaAtual = tarefas.find(tarefa => tarefa.id === tarefaEditadaId);

                  if (tarefaAtual) {
                    const projetoId = tarefaAtual.projeto_id;
                    if (!projetosIds.includes(projetoId)) {
                      projetosIds.push(projetoId); // Adiciona o projeto da tarefa atual se não estiver na lista
                    }
                  }
                }

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
            const colaboradorSelecionado = colaboradorId;
        
            if (colaboradorSelecionado) {
              try {
                const tarefas = await listTarefasColaborador();
        
                // Filtro normal de tarefas não finalizadas
                let tarefasFiltradas = tarefas.filter(tarefa =>
                  tarefa.tarefa_colaborador.some(tc => tc.colaborador_id === colaboradorSelecionado) &&
                  tarefa.data_fim_real === null && tarefa.data_inicio_real != null
                );
                console.log("Tarefas filtradas (não finalizadas) para select:", tarefasFiltradas); // Log das tarefas filtradas no select
        
                // Se estiver editando uma tarefa, adicione-a manualmente na lista, se ainda não estiver presente
                if (tarefaEditadaId) {
                  const tarefaAtual = tarefas.find(tarefa => tarefa.id === tarefaEditadaId);
                  console.log("Tarefa atual encontrada:", tarefaAtual); // Log da tarefa atual sendo editada
        
                  if (tarefaAtual && !tarefasFiltradas.some(tarefa => tarefa.id === tarefaAtual.id)) {
                    // Se a tarefa não estiver já na lista, adicione-a
                    tarefasFiltradas = [...tarefasFiltradas, tarefaAtual];
                    console.log("Tarefa adicionada à lista:", tarefaAtual); // Log da tarefa adicionada
                  }
                }
        
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
        {
          name: 'finalizar_tarefa',
          label: 'Deseja finalizar a tarefa?',
          type: 'select',
          options: [
            { value: true, label: 'Sim' },
            { value: false, label: 'Não' },
          ],
          required: true,
          formatOptionLabel: option => `${option.label}`,
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then((result) => {
        console.log('Result:', result)
        const formattedResult = formatForm(result).rebaseIds(['projeto', 'colaborador', 'tarefa']).getResult();
        console.log('Resultado formatado:', formattedResult);

        // // Certifique-se de que o ID da tarefa está sendo passado corretamente
        // if (tarefaEditadaId) {
        //   formattedResult.id = tarefaEditadaId; // Adiciona o ID da tarefa editada ao resultado formatado
        // }

        if (formattedResult.execucao_id) {
          formattedResult.id = formattedResult.execucao_id;
          // delete formattedResult.execucao_id;
        }
        // // Verifica se a resposta contém a execução e captura o execucao_id
        // if (result.tarefa_execucao && result.tarefa_execucao.id) {
        //   formattedResult.execucao_id = result.tarefa_execucao.id; // Adiciona o execucao_id ao resultado
        // }


        return formattedResult;
      })
      .then(async (result) => {
        handleGlobalLoading.show();

        const shouldFinalizeTask = result.finalizar_tarefa;
        console.log(shouldFinalizeTask);

        // Define o status da tarefa com base na seleção
        if (shouldFinalizeTask) {
          result.finalizar_tarefa = 'true';
        }
        // Verifique se o execucao_id está presente para determinar o método correto
        const method = result.execucao_id ? updateTarefaExecucao : createTarefaExecucao;

        // Exibe o execucao_id para depuração
        console.log('Execucao ID:', result.execucao_id); // Mudei aqui para acessar formattedResult.execucao_id

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
                console.log('ID da tarefa:', row.tarefa_id);  // Verifica se o ID está acessível
                callModalCadastro({
                  tarefa_id: row.tarefa_id,
                  colaborador_id: row.colaborador_id,
                  colaborador_nome: row.colaborador_nome,
                  tarefa_nome: row.tarefa_nome,
                  execucao_id: row.execucao_id,
                })
              },
              icon: FiEdit,
            },
          ]}


        />
      </Section>
    </Background>
  );
}
