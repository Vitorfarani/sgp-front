import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";


export const listTarefaStatus = async (params = "") => {
  let url = `tarefa-status${params}`;
  return _get(url);
}
export const createTarefaStatus = async (data) => {
  let url = 'tarefa-status/store';
  return _post(url, data);
}

export const showTarefaStatus = async (id) => {
  let url = `tarefa-status/show/${id}`;
  return _get(url);
}
export const updateTarefaStatus = async (data) => {
  let url = `tarefa-status/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaStatus = async (id) => {
  let url = `tarefa-status/delete/${id}`;
  return _delete(url);
}