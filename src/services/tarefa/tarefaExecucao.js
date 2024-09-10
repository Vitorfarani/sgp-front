import axios from "axios";
import { _delete, _get, _post, _put } from "..";

export const listTarefaExecucao = async (params = "") => {
  let url = `tarefa-execucao${params}`;
  return _get(url);
}

export const createTarefaExecucao = async (data) => {
  let url = 'tarefa-execucao';
  return _post(url, data);
}

export const getAllTarefaExecucao = async () => {
  let url = 'tarefa-execucao';
  return _get(url);
}

export const showTarefaExecucao = async (id) => {
  let url = `tarefa-execucao/${id}`;
  return _get(url);
}

export const updateTarefaExecucao = async (data) => {
  let url = `tarefa-execucao/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaExecucao = async (id) => {
  let url = `tarefa-execucao/${id}`;
  return _delete(url);
}