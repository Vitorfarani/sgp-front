import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listConhecimentos = async (params = "") => {
  let url = `conhecimento${params}`;
  return _get(url);
}

export const createConhecimento = async (data) => {
  let url = 'conhecimento/store';
  return _post(url, data);
}

export const showConhecimento = async (id) => {
  let url = `conhecimento/show/${id}`;
  return _get(url);
}
export const updateConhecimento = async (data) => {
  let url = `conhecimento/update/${data.id}`;
  return _put(url, data);
}

export const deleteConhecimento = async (id) => {
  let url = `conhecimento/delete/${id}`;
  return _delete(url);
}
