import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";


export const listConhecimentoClasses = async (params = "") => {
  let url = `conhecimentoclasse${params}`;
  return _get(url);
}

export const createConhecimentoClasse = async (data) => {
  let url = 'conhecimentoclasse/store';
  return _post(url, data);
}

export const showConhecimentoClasse = async (id) => {
  let url = `conhecimentoclasse/show/${id}`;
  return _get(url);
}
export const updateConhecimentoClasse = async (data) => {
  let url = `conhecimentoclasse/update/${data.id}`;
  return _put(url, data);
}

export const deleteConhecimentoClasse = async (id) => {
  let url = `conhecimentoclasse/delete/${id}`;
  return _delete(url);
}

