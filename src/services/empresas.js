import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";


export const listEmpresas = async (params = "") => {
  let url = `empresa${params}`;
  return _get(url);
}
export const createEmpresa = async (data) => {
  let url = 'empresa/store';
  return _post(url, data);
}

export const showEmpresa = async (id) => {
  let url = `empresa/show/${id}`;
  return _get(url);
}
export const updateEmpresa = async (data) => {
  let url = `empresa/update/${data.id}`;
  return _put(url, data);
}

export const deleteEmpresa = async (id) => {
  let url = `empresa/delete/${id}`;
  return _delete(url);
}