import axios from "axios";
import { _delete, _get, _post, _put } from ".";

export const listTarefas = async (params) => {
  let url = `tarefas${params}`;
  return _get(url);
}

export const createTarefa = async (data) => {
  let url = 'tarefas';
  return _post(url, data);
}

export const updateTarefa = async (id, data) => {
  let url = `tarefas/${id}`;
  return _put(url, data);
}

export const deleteTarefa = async (id) => {
  let url = `tarefas/${id}`;
  return _delete(url);
}