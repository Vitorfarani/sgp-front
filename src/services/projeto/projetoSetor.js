import axios from "axios";
import { _delete, _get, _patch, _post, _put, fakeFetch } from "..";


export const listProjetoSetor = async (params = "") => {
  let url = `projetosetor${params}`;
  return _get(url);
}
export const createProjetoSetor = async (data) => {
  let url = 'projetosetor/store';
  return _post(url, data);
}

export const showProjetoSetor = async (id) => {
  let url = `projetosetor/show/${id}`;
  return _get(url);
}
export const updateProjetoSetor = async (data) => {
  let url = `projetosetor/update/${data.id}`;
  return _put(url, data);
}

export const deleteProjetoSetor = async (id) => {
  let url = `projetosetor/delete/${id}`;
  return _delete(url);
}
export const mainProjetoSetor = async (id) => {
  let url = `projetosetor/principal/${id}`;
  return _patch(url);
}