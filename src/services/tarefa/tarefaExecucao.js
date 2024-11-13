import axios from "axios";
import { _delete, _get, _post, _put } from "..";

export const listTarefaExecucao = async (params = "") => {
  let url = `tarefa-execucao${params}`;
  return _get(url);
}

export const createTarefaExecucao = async (data) => {
  let url = 'tarefa-execucao/store';
  return _post(url, data);
}

export const showTarefaExecucao = async (id) => {
  let url = `tarefa-execucao/show/${id}`;
  return _get(url);
}

export const updateTarefaExecucao = async (data) => {
  let url = `tarefa-execucao/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaExecucao = async (id) => {
  let url = `tarefa-execucao/delete/${id}`;
  return _delete(url);
}

export const listColaboradorTarefaPorExecucao = async (params = "") => {
  let url = `tarefa-execucao/colaboradorTarefaPorExecucao${params}`;
  return _get(url);
}

export const listColaboradorTarefaPorExecucao2 = async ({ tarefa_id }) => {
  const params = new URLSearchParams({ tarefa_id }); // Adiciona tarefa_id como parâmetro
  const url = `tarefa-execucao/colaboradorTarefaPorExecucao?${params.toString()}`;
  return _get(url); // Chamada para o método _get
};

export const listTarefasColaborador = async (projetoId) => {
  const url = projetoId ? `tarefa?projeto_id=${projetoId}` : 'tarefa';
  
  try {
    const response = await _get(url);
    return response;
  } catch (error) {
    console.error('Error fetching tarefas:', error); 
    throw error; 
  }
};

export const listProjetosColaborador = async (colaboradorId) => {
  const url = colaboradorId ? `projeto?colaborador_id=${colaboradorId}` : 'projeto';
  
  try {
    const response = await _get(url);
    return response;
  } catch (error) {
    console.error('Error fetching projetos:', error); 
    throw error; 
  }
};

export const checkExecutionConflict = async (colaboradorId, dataInicio, dataFim, execucaoId) => {
  const url = 'tarefa-execucao/checkExecutionConflict';
  const data = {
    colaborador_id: colaboradorId,
    data_inicio: dataInicio,
    data_fim: dataFim,
    execucao_id: execucaoId,
  };
  
  try {
    const response = await _post(data, url);
    return response.data.conflict;
  } catch (error) {
    console.error('Error checking execution conflict:', error);
    throw error;
  }
};

export const finalizarTarefa = async (tarefaId, dataFimReal) => {
  if (!tarefaId) {
    console.error("ID da tarefa não foi fornecido!"); 
    return;
  }
  
  const url = `tarefa-execucao/finalizar/${id}`;
  const data = {
    data_fim_real: dataFimReal
  };

  try {
    const response = await _post(url, data);
    return response;
  } catch (error) {
    console.error('Erro ao finalizar tarefa:', error);
    throw error; 
  }
};

