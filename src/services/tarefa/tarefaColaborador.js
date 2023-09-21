import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";


export const listTarefaColaborador = async (params = "") => {
  let url = `tarefa-colaborador${params}`;
  return _get(url);
}
export const createTarefaColaborador = async (data) => {
  let url = 'tarefa-colaborador/store';
  return _post(url, data);
}

export const showTarefaColaborador = async (id) => {
  let url = `tarefa-colaborador/show/${id}`;
  return _get(url);
}
export const updateTarefaColaborador = async (data) => {
  let url = `tarefa-colaborador/update/${data.id}`;
  return _put(url, data);
}

export const deleteTarefaColaborador = async (id) => {
  let url = `tarefa-colaborador/delete/${id}`;
  return _delete(url);
}