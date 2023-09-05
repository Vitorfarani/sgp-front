import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";


export const listSimpleConhecimentoNivels = async () => {
  let url = `conhecimentoNivel/simple`;
  return _get(url);
}

export const listConhecimentoNivels = async (params) => {
  let url = `conhecimentoNivel${params}`;
  return _get(url);
}

export const createConhecimentoNivel = async (data) => {
  let url = 'conhecimentoNivel/store';
  return _post(url, data);
}

export const showConhecimentoNivel = async (id) => {
  let url = `conhecimentoNivel/show/${id}`;
  return _get(url);
}
export const updateConhecimentoNivel = async (data) => {
  let url = `conhecimentoNivel/update/${data.id}`;
  return _put(url, data);
}

export const deleteConhecimentoNivel = async (id) => {
  let url = `conhecimentoNivel/delete/${id}`;
  return _delete(url);
}

