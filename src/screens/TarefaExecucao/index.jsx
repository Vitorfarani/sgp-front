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
import { listSetores } from "@/services/setores";
import { listProjetos } from "@/services/projeto/projetos";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from 'xlsx';

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'data',
  sortOrder: 'asc',
};

const exportToPDF = (data, dataInicio, dataFim) => {
  const doc = new jsPDF();

  const title = `Execução de Tarefas - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})`;
  doc.setFontSize(14);
  doc.text(title, 14, 22);


  const startY = 30;
  doc.autoTable({
    startY: startY,
    head: [[
      'Colaborador',
      'Projeto',
      'Tarefa',
      'Inicio Execução',
      'Fim Execução'
    ]],
    body: data.map(item => ([
      item.colaborador_nome || '',
      item.projeto_nome || '',
      item.tarefa_nome || '',
      item.data_inicio_execucao || '',
      item.data_fim_execucao || '',
    ])),
    theme: 'grid',
    styles: {
      cellPadding: 3,
      fontSize: 7,
      halign: 'center'
    },
    headStyles: {
      fillColor: [52, 84, 143],
      textColor: [255, 255, 255],
      fontSize: 6
    },
    margin: { top: startY }
  });

  const fileName = `relatorio_execução_tarefas_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.pdf`;
  doc.save(fileName);
};

const exportToCSV = (data, dataInicio, dataFim) => {
  const csvRows = [];

  const headers = [
      'Colaborador',
      'Projeto',
      'Tarefa',
      'Inicio Execução',
      'Fim Execução'
  ];
  csvRows.push(headers.join(','));

  data.forEach(item => {
      const row = [
          item.colaborador_nome || '',
          item.projeto_nome || '',
          item.tarefa_nome || '',
          item.data_inicio_execucao || '',
          item.data_fim_execucao || ''
      ];
      csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_execucao_tarefas_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportToXLSX = (data, dataInicio, dataFim) => {
  const orderedColumns = [
      { field: 'colaborador_nome', header: 'Colaborador' },
      { field: 'projeto_nome', header: 'Projeto' },
      { field: 'tarefa_nome', header: 'Tarefa' },
      { field: 'data_inicio_execucao', header: 'Inicio Execução' },
      { field: 'data_fim_execucao', header: 'Fim Execução' }
  ];

  const formattedData = data.map(item => {
      const orderedData = {};
      orderedColumns.forEach(col => {
          orderedData[col.header] = item[col.field] || ''; 
      });
      return orderedData;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

  const fileName = `relatorio_execucao_tarefas_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};



const columnsFields = [
  { field: 'colaborador_nome', label: 'Colaborador', enabledOrder: true },
  { field: 'projeto_nome', label: 'Projeto', enabledOrder: true },
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
  const [formData, setFormData] = useState({});


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
            projeto_nome: tarefa.projeto_nome || "",
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


    // Tentando capturar o ID corretamente
    const tarefaEditadaId = data?.tarefa_id || data?.id || null;

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
          isDisabled: user?.nivel_acesso !== 2, // Desativa o campo se o nível de acesso não for 2

        },
        // {
        //   name: 'projeto',
        //   label: 'Projeto',
        //   type: 'selectAsync',
        //   isClearable: true,
        //   loadOptions: async () => {
        //     const colaboradorSelecionado = colaboradorId;

        //     if (colaboradorSelecionado) {
        //       try {
        //         const tarefas = await listTarefasColaborador();
        //         const tarefasFiltradas = tarefas.filter(tarefa =>
        //           tarefa.tarefa_colaborador.some(tc => tc.colaborador_id === colaboradorSelecionado) &&
        //           tarefa.data_fim_real === null && (tarefa.data_inicio_real != null || tarefa.data_inicio_real === null) 
        //         );

        //         const projetosIds = [...new Set(tarefasFiltradas.map(tarefa => tarefa.projeto_id))];

        //         // Adiciona a tarefa sendo editada, se estiver definida
        //         if (tarefaEditadaId) {
        //           const tarefaAtual = tarefas.find(tarefa => tarefa.id === tarefaEditadaId);

        //           if (tarefaAtual) {
        //             const projetoId = tarefaAtual.projeto_id;
        //             if (!projetosIds.includes(projetoId)) {
        //               projetosIds.push(projetoId); // Adiciona o projeto da tarefa atual se não estiver na lista
        //             }
        //           }
        //         }

        //         if (projetosIds.length > 0) {
        //           const todosProjetos = await listProjetosColaborador();
        //           const projetosFiltradosPorId = todosProjetos.filter(projeto => projetosIds.includes(projeto.id));

        //           return projetosFiltradosPorId;
        //         } else {
        //           return [];
        //         }
        //       } catch (error) {
        //         console.error('Error fetching projetos:', error);
        //         return [];
        //       }
        //     }
        //     return [];
        //   },
        //   required: true,
        //   formatOptionLabel: option => `${option.nome}`,
        // },
        {
          name: 'tarefa',
          label: 'Tarefa',
          type: 'selectAsync',
          loadOptions: async (inputValue, formValues) => {
            const colaboradorSelecionado = colaboradorId;
            const nivelAcesso = user?.nivel_acesso;

            try {
              const tarefas = await listTarefasColaborador();

              let tarefasFiltradas = tarefas.filter(tarefa =>
                tarefa.data_fim_real === null &&
                (tarefa.data_inicio_real != null || tarefa.data_inicio_real === null) &&
                (nivelAcesso === 2 || // Condição para o gerente ver todas as tarefas
                  tarefa.tarefa_colaborador.some(tc => tc.colaborador_id === colaboradorSelecionado))
              );

              // Adiciona a tarefa editada, se existir
              if (tarefaEditadaId) {
                const tarefaAtual = tarefas.find(tarefa => tarefa.id === tarefaEditadaId);
                if (tarefaAtual) {
                  // Remove a tarefa atual se ela já estiver nas tarefas filtradas
                  tarefasFiltradas = tarefasFiltradas.filter(tarefa => tarefa.id !== tarefaAtual.id);
                  // Coloca a tarefa atual no início da lista
                  tarefasFiltradas.unshift(tarefaAtual);
                }
              }
              const projetosIds = [...new Set(tarefasFiltradas.map(tarefa => tarefa.projeto_id))];

              if (projetosIds.length > 0) {
                const todosProjetos = await listProjetosColaborador();
                const projetosFiltradosPorId = todosProjetos.filter(projeto => projetosIds.includes(projeto.id));

                tarefasFiltradas = tarefasFiltradas.map(tarefa => {
                  const projeto = projetosFiltradosPorId.find(proj => proj.id === tarefa.projeto_id);
                  const colaboradorResponsavel = tarefa.tarefa_colaborador[0]?.colaborador?.nome || 'Colaborador não encontrado';
                  return {
                    ...tarefa,
                    projeto: projeto ? { nome: projeto.nome } : { nome: 'Projeto não encontrado' },
                    colaboradorResponsavel,
                  };
                });
              }

              return tarefasFiltradas;

            } catch (error) {
              console.error('Error fetching tarefas:', error);
              return [];
            }
          },
          required: true,
          formatOptionLabel: option => {
            const nivelAcesso = user?.nivel_acesso; // Obtém o nível de acesso do usuário
            if (nivelAcesso === 2) {
              // Se o usuário for gerente, exibe o colaborador responsável
              return `${option.nome} - ${option.projeto.nome} - ${option.colaboradorResponsavel}`;
            }
            // Caso contrário, exibe apenas nome e projeto
            return `${option.nome} - ${option.projeto.nome}`;
          },
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

        if (formattedResult.execucao_id) {
          formattedResult.id = formattedResult.execucao_id;
        }


        return formattedResult;
      })
      .then(async (result) => {
        handleGlobalLoading.show();

        const shouldFinalizeTask = result.finalizar_tarefa;
        console.log(shouldFinalizeTask);

        if (shouldFinalizeTask) {
          result.finalizar_tarefa = 'true';
        }

        const method = result.execucao_id ? updateTarefaExecucao : createTarefaExecucao;

        // Exibe o execucao_id para depuração
        console.log('Execucao ID:', result.execucao_id);

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

    handleChangeFilters('data_inicio_execucao', dataInicio)
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
          ...(user.nivel_acesso !== 5 ? [
            {
              label: 'Registrar Execução',
              onClick: () => callModalCadastro(cadastroInitialValue),
              icon: FiPlus,
            }
          ] : []),
          ...(user.nivel_acesso === 2 ? [
            {
              label: 'Exportar como PDF',
              onClick: () => exportToPDF(rows, dataInicio, dataFim),
              icon: FaFilePdf
            },
            {
              label: 'Exportar como CSV',
              onClick: () => exportToCSV(rows, dataInicio, dataFim),
              icon: FaFileCsv
          },
          {
              label: 'Exportar como XLSX',
              onClick: () => exportToXLSX(rows, dataInicio, dataFim),
              icon: FaFileExcel
          }
          ] : []),
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
              {user.nivel_acesso === 2 && (<Col md={2} >
                <SelectAsync
                  placeholder="Filtrar por Colaborador"
                  loadOptions={(search) => listColaboradores('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(colaborador) => {
                    handleChangeFilters('colaborador_id', colaborador ? colaborador.id : null);
                  }}
                  isClearable
                />
              </Col>
              )}
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Projeto"
                  loadOptions={(search) => listProjetos('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(projeto) => {
                    handleChangeFilters('projeto_id', projeto ? projeto.id : null);
                  }}
                  isClearable
                />
              </Col>
              {user.nivel_acesso === 2 && (
                <Col md={2}>
                  <SelectAsync
                    placeholder="Filtrar por Setor"
                    loadOptions={(search) => listSetores('?search=' + search)}
                    getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                    onChange={(setor) => {
                      handleChangeFilters('setor_id', setor ? setor.id : null);
                    }}
                    isClearable
                  />
                </Col>
              )}
              <Col md={2}>
                <DateTest
                  id="dataFim"
                  value={dataFim}
                  label="Fim:"
                  onChange={(date) => {
                    setDataFim(date);
                    handleChangeFilters('data_fim_execucao', date);
                  }}
                />
              </Col>
              <Col md={2}>
                <DateTest
                  id="dataInicio"
                  value={dataInicio}
                  label="Início:"
                  onChange={(date) => {
                    setDataInicio(date);
                    handleChangeFilters('data_inicio_execucao', date);
                  }}
                />
              </Col>
            </>
          }
          handleFilters={handleChangeFilters}
          // Aqui é onde fazemos a verificação do nível de acesso
          actions={
            user.nivel_acesso !== 5
              ? [
                {
                  label: 'Editar',
                  onClick: (row) => {
                    console.log('ID da tarefa:', row.tarefa_id);
                    callModalCadastro({
                      tarefa_id: row.tarefa_id,
                      colaborador_id: row.colaborador_id,
                      colaborador_nome: row.colaborador_nome,
                      tarefa_nome: row.tarefa_nome,
                      execucao_id: row.execucao_id,
                    });
                  },
                  icon: FiEdit,
                },
              ]
              : []
          }
        />
      </Section>
    </Background>
  );
}
