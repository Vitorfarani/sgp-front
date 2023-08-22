import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_clients = [
  { value: 1, label: 'Cliente A' },
  { value: 2, label: 'Cliente B' },
  { value: 3, label: 'Cliente C' }
];

export const listClientes = async (params) => {
  console.log('listClientes')
  return fakeFetch(MOCK_clients);
  let url = `clientes${params}`;
  return _get(url);
}

export const createCliente = async (data) => {
  let url = 'clientes';
  return _post(url, data);
}

export const editCliente = async (id, data) => {
  let url = `clientes/${id}`;
  return _put(url, data);
}

export const deleteCliente = async (id) => {
  let url = `clientes/${id}`;
  return _delete(url);
}