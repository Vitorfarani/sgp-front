import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listClientes = async (params = "") => {
  let url = `cliente${params}`;
  return _get(url);
}

export const createCliente = async (data) => {
  let url = 'cliente/store';
  return _post(url, data);
}

export const showCliente = async (id) => {
  let url = `cliente/show/${id}`;
  return _get(url);
}

export const updateCliente = async (data) => {
  let url = `cliente/update/${data.id}`;
  return _put(url, data);
}

export const deleteCliente = async (id) => {
  let url = `cliente/delete/${id}`;
  return _delete(url);
}