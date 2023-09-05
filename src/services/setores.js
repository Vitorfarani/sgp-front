import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

const MOCK_companySectors = [
  { id: 1, nome: 'Recursos Humanos', color: '#336699' },   // Azul (cor associada a RH)
  { id: 2, nome: 'Desenvolvimento de Produtos', color: '#E53E3E' },   // Vermelho (cor associada ao Desenvolvimento)
  { id: 3, nome: 'Finanças', color: '#6A994E' },           // Verde (cor associada a Finanças)
  { id: 4, nome: 'Marketing', color: '#FFC107' },          // Amarelo (cor associada a Marketing)
  { id: 5, nome: 'Vendas', color: '#FF5733' },             // Laranja (cor associada a Vendas)
  { id: 6, nome: 'Tecnologia da Informação', color: '#A9DFBF' },  // Verde (cor associada a TI)
  { id: 7, nome: 'Logística', color: '#FF6B6B' },          // Vermelho (cor associada a Logística)
  { id: 8, nome: 'Jurídico', color: '#800080' },           // Roxo (cor associada a Jurídico)
  { id: 9, nome: 'Operações', color: '#3498DB' },          // Azul (cor associada a Operações)
  { id: 10, nome: 'Pesquisa e Desenvolvimento', color: '#F39C12' } // Laranja (cor associada a P&D)
];


export const listSetores = async (search) => {
  let url = `setor${params}`;
  return _get(url);
}

export const listSimpleSetores = async () => {
  let url = `setor/simple`;
  return _get(url);
}

export const createSetor = async (data) => {
  let url = 'setor/store';
  return _post(url, data);
}

export const showSetor = async (id, data) => {
  let url = `setor/show/${id}`;
  return _get(url);
}
export const updateSetor = async (id, data) => {
  let url = `setor/update/${id}`;
  return _put(url, data);
}

export const deleteSetor = async (id) => {
  let url = `setor/delete/${id}`;
  return _delete(url);
}