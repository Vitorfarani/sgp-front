import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listFuncao = async (params = "") => {
  let url = `funcao${params}`;
  return _get(url);
}

export const createFuncao = async (data) => {
  let url = 'funcao/store';
  return _post(url, data);
}

export const showFuncao = async (id) => {
  let url = `funcao/show/${id}`;
  return _get(url);
}

export const updateFuncao = async (data) => {
  let url = `funcao/update/${data.id}`;
  return _put(url, data);
}

export const deleteFuncao = async (id) => {
  let url = `funcao/delete/${id}`;
  return _delete(url);
}