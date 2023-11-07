import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listContatos = async (params = "") => {
  let url = `contato${params}`;
  return _get(url);
}

export const createContato = async (data) => {
  let url = 'contato/store';
  return _post(url, data);
}

export const showContato = async (id) => {
  let url = `contato/show/${id}`;
  return _get(url);
}
export const updateContato = async (data) => {
  let url = `contato/update/${data.id}`;
  return _put(url, data);
}

export const deleteContato = async (id) => {
  let url = `contato/delete/${id}`;
  return _delete(url);
}