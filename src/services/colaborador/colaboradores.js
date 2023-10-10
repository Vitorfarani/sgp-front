import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listColaboradores = async (params = "") => {
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

export const updateColaborador = async (data) => {
  let url = `colaborador/update/${data.id}`;
  return _put(url, data);
}

export const deleteColaborador = async (id) => {
  let url = `colaborador/delete/${id}`;
  return _delete(url);
}