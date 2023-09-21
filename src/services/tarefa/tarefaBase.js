import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listTarefaBase = async (params = "") => {
  let url = `tarefa-base${params}`;
  return _get(url);
}
export const createTarefaBase = async (data) => {
  let url = 'tarefa-base/store';
  return _post(url, data);
}

export const showTarefaBase = async (id) => {
  let url = `tarefa-base/show/${id}`;
  return _get(url);
}
export const updateTarefaBase = async (data) => {
  let url = `tarefa-base/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaBase = async (id) => {
  let url = `tarefa-base/delete/${id}`;
  return _delete(url);
}