import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";


export const listSetores = async (params) => {
  let url = `setores${params}`;
  return _get(url);
}

export const createSetor = async (data) => {
  let url = 'setores';
  return _post(url, data);
}

export const updateSetor = async (id, data) => {
  let url = `setores/${id}`;
  return _put(url, data);
}

export const deleteSetor = async (id) => {
  let url = `setores/${id}`;
  return _delete(url);
}