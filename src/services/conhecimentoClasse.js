import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";


export const listSimpleConhecimentoClasses = async () => {
  let url = `conhecimentoClasse/simple`;
  return _get(url);
}

export const listConhecimentoClasses = async (params) => {
  let url = `conhecimentoClasse${params}`;
  return _get(url);
}

export const createConhecimentoClasse = async (data) => {
  let url = 'conhecimentoClasse/store';
  return _post(url, data);
}

export const showConhecimentoClasse = async (id) => {
  let url = `conhecimentoClasse/show/${id}`;
  return _get(url);
}
export const updateConhecimentoClasse = async (data) => {
  let url = `conhecimentoClasse/update/${data.id}`;
  return _put(url, data);
}

export const deleteConhecimentoClasse = async (id) => {
  let url = `conhecimentoClasse/delete/${id}`;
  return _delete(url);
}

