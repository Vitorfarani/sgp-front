import { _delete, _get, _post, _put } from ".";

export const listFeriados = async (params = "") => {
  let url = `feriados${params}`;
  return _get(url);
}

export const createFeriado = async (data) => {
  let url = 'feriados';
  return _post(url, data);
}

export const updateFeriado = async (data) => {
  let url = `feriados/${data.id}`;
  return _put(url, data);
}

export const deleteFeriado = async (id) => {
  let url = `feriados/${id}`;
  return _delete(url);
}