import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_clients = [
  { id: 1, nome: 'Cliente A' },
  { id: 2, nome: 'Cliente B' },
  { id: 3, nome: 'Cliente C' }
];

export const listClientes = async (params) => {
  console.log(params)
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