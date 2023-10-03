import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listTarefaObservacao = async (params = "") => {
  let url = `tarefa-observacao${params}`;
  return _get(url);
}
export const createTarefaObservacao = async (data) => {
  let url = 'tarefa-observacao/store';
  return _post(url, data);
}

export const showTarefaObservacao = async (id) => {
  let url = `tarefa-observacao/show/${id}`;
  return _get(url);
}
export const updateTarefaObservacao = async (data) => {
  let url = `tarefa-observacao/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaObservacao = async (id) => {
  let url = `tarefa-observacao/delete/${id}`;
  return _delete(url);
}