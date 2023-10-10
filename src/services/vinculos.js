import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from ".";

export const listVinculo = async (params = "") => {
  let url = `vinculo${params}`;
  return _get(url);
}

export const createVinculo = async (data) => {
  let url = 'vinculo/store';
  return _post(url, data);
}

export const showVinculo = async (id) => {
  let url = `vinculo/show/${id}`;
  return _get(url);
}

export const updateVinculo = async (data) => {
  let url = `vinculo/update/${data.id}`;
  return _put(url, data);
}

export const deleteVinculo = async (id) => {
  let url = `vinculo/delete/${id}`;
  return _delete(url);
}