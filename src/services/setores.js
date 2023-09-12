import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listSetores = async (params = "") => {
  let url = `setor${params}`;
  return _get(url);
}

export const createSetor = async (data) => {
  let url = 'setor/store';
  return _post(url, data);
}

export const showSetor = async (id) => {
  let url = `setor/show/${id}`;
  return _get(url);
}
export const updateSetor = async (data) => {
  let url = `setor/update/${data.id}`;
  return _put(url, data);
}

export const deleteSetor = async (id) => {
  let url = `setor/delete/${id}`;
  return _delete(url);
}