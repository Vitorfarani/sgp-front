import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listColaboradorConhecimento = async (params = "") => {
  let url = `colaboradorConhecimento${params}`;
  return _get(url);
}

export const createColaboradorConhecimento = async (data) => {
  let url = 'colaboradorConhecimento/store';
  return _post(url, data);
}

export const showColaboradorConhecimento = async (id) => {
  let url = `colaboradorConhecimento/show/${id}`;
  return _get(url);
}
export const updateColaboradorConhecimento = async (data) => {
  let url = `colaboradorConhecimento/update/${data.id}`;
  return _put(url, data);
}

export const deleteColaboradorConhecimento = async (id) => {
  let url = `colaboradorConhecimento/delete/${id}`;
  return _delete(url);
}