import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_productPhases = [
  { id: 1, nome: 'Planejamento', color: '#336699' },    // Azul (cor associada a Planejamento)
  { id: 2, nome: 'Design', color: '#E53E3E' },           // Vermelho (cor associada a Design)
  { id: 3, nome: 'Desenvolvimento', color: '#6A994E' },  // Verde (cor associada a Desenvolvimento)
  { id: 4, nome: 'Homologação', color: '#FFC107' },           // Amarelo (cor associada a Testes)
  { id: 5, nome: 'Produção', color: '#FF5733' },       // Laranja (cor associada a Lançamento)
  { id: 6, nome: 'Pós-Produção', color: '#A9DFBF' }     // Verde (cor associada a Monitoramento)
];


export const listFases = async (params) => {
  console.log('listFases')
  return fakeFetch(MOCK_productPhases);
  let url = `fases${params}`;
  return _get(url);
}

export const createFase = async (data) => {
  let url = 'fases';
  return _post(url, data);
}

export const updateFase = async (id, data) => {
  let url = `fases/${id}`;
  return _put(url, data);
}

export const deleteFase = async (id) => {
  let url = `fases/${id}`;
  return _delete(url);
}