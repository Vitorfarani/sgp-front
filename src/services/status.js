import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_statuses = [
  { id: 1, nome: 'Em Progresso', color: '#336699' },  // Azul (cor associada a Em Progresso)
  { id: 2, nome: 'Concluído', color: '#4CAF50' },    // Verde (cor associada a Concluído)
  { id: 3, nome: 'Atrasado', color: '#E53E3E' },      // Vermelho (cor associada a Atrasado)
  { id: 4, nome: 'Pausado', color: '#FFC107' },       // Amarelo (cor associada a Pausado)
  { id: 5, nome: 'Cancelado', color: '#FF5733' }      // Laranja (cor associada a Cancelado)
];


export const listStatuses = async (params) => {
  console.log('listStatus')
  return fakeFetch(MOCK_statuses);
  let url = `statuses${params}`;
  return _get(url);
}

export const createStatus = async (data) => {
  let url = 'statuses';
  return _post(url, data);
}

export const updateStatus = async (id, data) => {
  let url = `statuses/${id}`;
  return _put(url, data);
}

export const deleteStatus = async (id) => {
  let url = `statuses/${id}`;
  return _delete(url);
}