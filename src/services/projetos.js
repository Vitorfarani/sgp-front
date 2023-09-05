import { _delete, _get, _post, _put } from ".";

export const listProjetos = async (params) => {
  let url = `projeto${params}`;
  return _get(url);
}

export const createProjeto = async (data) => {
  let url = 'projeto/store';
  return _post(url, data);
}

export const showProjeto = async (id) => {
  let url = `projeto/show/${id}`;
  return _get(url);
}
export const updateProjeto = async (id, data) => {
  let url = `projeto/update/${id}`;
  return _put(url, data);
}

export const deleteProjeto = async (id) => {
  let url = `projeto/delete/${id}`;
  return _delete(url);
}