import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_peopleNames = [
  { id: 1, nome: 'João Silva' },
  { id: 2, nome: 'Maria Santos' },
  { id: 3, nome: 'Pedro Almeida' },
  { id: 4, nome: 'Ana Costa' },
  { id: 5, nome: 'Rafael Oliveira' },
  { id: 6, nome: 'Carla Pereira' },
  { id: 7, nome: 'José Sousa' },
  { id: 8, nome: 'Mariana Fernandes' },
  { id: 9, nome: 'André Lopes' },
  { id: 10, nome: 'Isabela Rodrigues' }
];

export const listSimpleColaboradores = async () => {
  let url = `colaborador/simple`;
  return _get(url);
}

export const listColaboradores = async (params) => {
  let url = `colaborador${params}`;
  return _get(url);
}

export const createColaborador = async (data) => {
  let url = 'colaborador/store';
  return _post(url, data);
}

export const showColaborador = async (id) => {
  let url = `colaborador/show/${id}`;
  return _get(url);
}
export const updateColaborador = async (id, data) => {
  let url = `colaborador/update/${id}`;
  return _put(url, data);
}

export const deleteColaborador = async (id) => {
  let url = `colaborador/delete/${id}`;
  return _delete(url);
}