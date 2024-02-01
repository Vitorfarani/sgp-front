import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listProjetosByStatus = async (params = "") => {
  let url = `dashboard/projetosByStatus${params}`;
  return _get(url);
}
export const listTarefasByStatus = async (params = "") => {
  let url = `dashboard/tarefasByStatus${params}`;
  return _get(url);
}
export const listTarefasByTime = async (params = "") => {
  let url = `dashboard/tarefasByTime${params}`;
  return _get(url);
}
export const listtarefasByAndamento = async (params = "") => {
  let url = `dashboard/tarefasByAndamento${params}`;
  return _get(url);
}

