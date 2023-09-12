import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listConhecimentoNivels = async (params = "") => {
  let url = `conhecimentonivel${params}`;
  return _get(url);
}

export const createConhecimentoNivel = async (data) => {
  let url = 'conhecimentonivel/store';
  return _post(url, data);
}

export const showConhecimentoNivel = async (id) => {
  let url = `conhecimentonivel/show/${id}`;
  return _get(url);
}
export const updateConhecimentoNivel = async (data) => {
  let url = `conhecimentonivel/update/${data.id}`;
  return _put(url, data);
}

export const deleteConhecimentoNivel = async (id) => {
  let url = `conhecimentonivel/delete/${id}`;
  return _delete(url);
}

