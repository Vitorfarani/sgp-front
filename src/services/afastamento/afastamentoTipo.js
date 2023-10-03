import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listAfastamentoTipos = async (params = "") => {
  let url = `afastamento-tipo${params}`;
  return _get(url);
}

export const createAfastamentoTipo = async (data) => {
  let url = 'afastamento-tipo/store';
  return _post(url, data);
}

export const showAfastamentoTipo = async (id) => {
  let url = `afastamento-tipo/show/${id}`;
  return _get(url);
}

export const updateAfastamentoTipo = async (data) => {
  let url = `afastamento-tipo/update/${data.id}`;
  return _put(url, data);
}

export const deleteAfastamentoTipo = async (id) => {
  let url = `afastamento-tipo/delete/${id}`;
  return _delete(url);
}