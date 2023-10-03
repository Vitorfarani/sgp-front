import axios from "axios";
import { _delete, _get, _patch, _post, _put } from "..";

export const listTarefas = async (params) => {
  let url = `tarefa${params}`;
  return _get(url);
}

export const createTarefa = async (data) => {
  let url = 'tarefa/store';
  return _post(url, data);
}

export const showTarefa = async (id) => {
  let url = `tarefa/show/${id}`;
  return _get(url);
}
export const updateTarefa = async (data) => {
  let url = `tarefa/update/${data.id}`;
  return _put(url, data);
}
export const updateTarefaPositionFromKanban = async (id, data) => {
  let url = `tarefa/update-position/${id}`;
  return _patch(url, data);
}

export const deleteTarefa = async (id) => {
  let url = `tarefa/delete/${id}`;
  return _delete(url);
}
export const interromperTarefa = async (data) => {
  let url = `tarefa/interromper/${data.id}`;
  return _patch(url, data);
}

export const restoreTarefa = async (id) => {
  let url = `tarefa/restaurar/${id}`;
  return _patch(url);
}