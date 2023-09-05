import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listEmpresas = async (params) => {
  // return fakeFetch(MOCK_languages);
  let url = `empresa${params}`;
  return _get(url);
}

export const createEmpresa = async (data) => {
  console.log('createEmpresa')
  let url = 'empresa';
  return _post(url, data);
}

export const showEmpresa = async (id) => {
  let url = `Empresa/${id}`;
  return _get(url);
}
export const updateEmpresa = async (data) => {
  let url = `empresa/${data.id}`;
  return _put(url, data);
}

export const deleteEmpresa = async (id) => {
  let url = `empresas/${id}`;
  return _delete(url);
}