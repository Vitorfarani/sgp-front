import axios from "axios";
import { _delete, _get, _patch, _post, _put, fakeFetch } from "..";


export const listProjetoConhecimento = async (params = "") => {
  let url = `projetoconhecimento${params}`;
  return _get(url);
}
export const createProjetoConhecimento = async (data) => {
  let url = 'projetoconhecimento/store';
  return _post(url, data);
}

export const showProjetoConhecimento = async (id) => {
  let url = `projetoconhecimento/show/${id}`;
  return _get(url);
}
export const updateProjetoConhecimento = async (data) => {
  let url = `projetoconhecimento/update/${data.id}`;
  return _put(url, data);
}

export const deleteProjetoConhecimento = async (id) => {
  let url = `projetoconhecimento/delete/${id}`;
  return _delete(url);
}
