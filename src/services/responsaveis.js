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


export const listResponsaveis = async (params) => {
  console.log(params)
  return fakeFetch(MOCK_peopleNames);
  let url = `responsaveis${params}`;
  return _get(url);
}

export const createResponsavel = async (data) => {
  let url = 'responsaveis';
  return _post(url, data);
}

export const editResponsavel = async (id, data) => {
  let url = `responsaveis/${id}`;
  return _put(url, data);
}

export const deleteResponsavel = async (id) => {
  let url = `responsaveis/${id}`;
  return _delete(url);
}