import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listProjetoFases = async (params = "") => {
  let url = `projetofase${params}`;
  return _get(url);
}
export const createProjetoFases = async (data) => {
  let url = 'projetofase/store';
  return _post(url, data);
}

export const showProjetoFases = async (id) => {
  let url = `projetofase/show/${id}`;
  return _get(url);
}
export const updateProjetoFases = async (data) => {
  let url = `projetofase/update/${data.id}`;
  return _put(url, data);
}

export const deleteProjetoFases = async (id) => {
  let url = `projetofase/delete/${id}`;
  return _delete(url);
}