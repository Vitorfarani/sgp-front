import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_languages = [
  { value: 1, label: 'JavaScript', color: '#f0db4f' },   // Amarelo (cor associada ao JS)
  { value: 2, label: 'Python', color: '#3572A5' },       // Azul (cor associada ao Python)
  { value: 3, label: 'Java', color: '#5382A1' },         // Azul (cor associada ao Java)
  { value: 4, label: 'C#', color: '#68217A' },           // Roxo (cor associada ao C#)
  { value: 5, label: 'PHP', color: '#4F5D95' },          // Azul (cor associada ao PHP)
  { value: 6, label: 'Ruby', color: '#CC342D' },         // Vermelho (cor associada ao Ruby)
  { value: 7, label: 'Swift', color: '#FFAC45' },        // Laranja (cor associada ao Swift)
  { value: 8, label: 'C++', color: '#00599C' },          // Azul (cor associada ao C++)
  { value: 9, label: 'TypeScript', color: '#3178C6' },   // Azul (cor associada ao TypeScript)
  { value: 10, label: 'Go', color: '#00ADD8' }           // Azul (cor associada ao Go)
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