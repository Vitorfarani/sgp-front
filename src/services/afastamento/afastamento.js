import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listAfastamentos = async (params = "") => {
  let url = `afastamento${params}`;
  return _get(url);
}

export const createAfastamento = async (data) => {
  let url = 'afastamento/store';
  return _post(url, data);
}

export const showAfastamento = async (id) => {
  let url = `afastamento/show/${id}`;
  return _get(url);
}

export const updateAfastamento = async (data) => {
  let url = `afastamento/update/${data.id}`;
  return _put(url, data);
}

export const deleteAfastamento = async (id) => {
  let url = `afastamento/delete/${id}`;
  return _delete(url);
}