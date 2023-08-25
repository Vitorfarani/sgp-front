import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_languages = [
  { id: 1, nome: 'JavaScript', color: '#f0db4f' },   // Amarelo (cor associada ao JS)
  { id: 2, nome: 'Python', color: '#3572A5' },       // Azul (cor associada ao Python)
  { id: 3, nome: 'Java', color: '#5382A1' },         // Azul (cor associada ao Java)
  { id: 4, nome: 'C#', color: '#68217A' },           // Roxo (cor associada ao C#)
  { id: 5, nome: 'PHP', color: '#4F5D95' },          // Azul (cor associada ao PHP)
  { id: 6, nome: 'Ruby', color: '#CC342D' },         // Vermelho (cor associada ao Ruby)
  { id: 7, nome: 'Swift', color: '#FFAC45' },        // Laranja (cor associada ao Swift)
  { id: 8, nome: 'C++', color: '#00599C' },          // Azul (cor associada ao C++)
  { id: 9, nome: 'TypeScript', color: '#3178C6' },   // Azul (cor associada ao TypeScript)
  { id: 10, nome: 'Go', color: '#00ADD8' }           // Azul (cor associada ao Go)
];



export const listConhecimentos = async (params) => {
  console.log('listConhecimentos')
  return fakeFetch(MOCK_languages);
  let url = `conhecimentos${params}`;
  return _get(url);
}

export const createConhecimento = async (data) => {
  let url = 'conhecimentos';
  return _post(url, data);
}

export const editConhecimento = async (id, data) => {
  let url = `conhecimentos/${id}`;
  return _put(url, data);
}

export const deleteConhecimento = async (id) => {
  let url = `conhecimentos/${id}`;
  return _delete(url);
}