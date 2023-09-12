import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";


export const listProjetoStatus = async (params = "") => {
  let url = `projetostatus${params}`;
  return _get(url);
}
export const createProjetoStatus = async (data) => {
  let url = 'projetostatus/store';
  return _post(url, data);
}

export const showProjetoStatus = async (id) => {
  let url = `projetostatus/show/${id}`;
  return _get(url);
}
export const updateProjetoStatus = async (data) => {
  let url = `projetostatus/update/${data.id}`;
  return _put(url, data);
}

export const deleteProjetoStatus = async (id) => {
  let url = `projetostatus/delete/${id}`;
  return _delete(url);
}