import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";


export const listProjetoResponsavel = async (params = "") => {
  let url = `projetoresponsavel${params}`;
  return _get(url);
}
export const createProjetoResponsavel = async (data) => {
  let url = 'projetoresponsavel/store';
  return _post(url, data);
}

export const showProjetoResponsavel = async (id) => {
  let url = `projetoresponsavel/show/${id}`;
  return _get(url);
}
export const updateProjetoResponsavel = async (data) => {
  let url = `projetoresponsavel/update/${data.id}`;
  return _put(url, data);
}

export const deleteProjetoResponsavel = async (id) => {
  let url = `projetoresponsavel/delete/${id}`;
  return _delete(url);
}