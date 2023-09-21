import axios from "axios";
import { _delete, _get, _patch, _post, _put, fakeFetch } from "..";


export const listTarefaConhecimento = async (params = "") => {
  let url = `tarefa-conhecimento${params}`;
  return _get(url);
}
export const createTarefaConhecimento = async (data) => {
  let url = 'tarefa-conhecimento/store';
  return _post(url, data);
}

export const showTarefaConhecimento = async (id) => {
  let url = `tarefa-conhecimento/show/${id}`;
  return _get(url);
}
export const updateTarefaConhecimento = async (data) => {
  let url = `tarefa-conhecimento/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaConhecimento = async (id) => {
  let url = `tarefa-conhecimento/delete/${id}`;
  return _delete(url);
}
