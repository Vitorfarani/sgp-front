import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listTarefaClasse = async (params = "") => {
  let url = `tarefa-classe${params}`;
  return _get(url);
}
export const createTarefaClasse = async (data) => {
  let url = 'tarefa-classe/store';
  return _post(url, data);
}

export const showTarefaClasse = async (id) => {
  let url = `tarefa-classe/show/${id}`;
  return _get(url);
}
export const updateTarefaClasse = async (data) => {
  let url = `tarefa-classe/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaClasse = async (id) => {
  let url = `tarefa-classe/delete/${id}`;
  return _delete(url);
}