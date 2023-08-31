import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";


export const listClientes = async (params) => {
  let url = `clientes${params}`;
  return _get(url);
}

export const createCliente = async (data) => {
  let url = 'clientes';
  return _post(url, data);
}

export const updateCliente = async (id, data) => {
  let url = `clientes/${id}`;
  return _put(url, data);
}

export const deleteCliente = async (id) => {
  let url = `clientes/${id}`;
  return _delete(url);
}