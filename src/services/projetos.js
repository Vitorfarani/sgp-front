import { _delete, _get, _post, _put } from ".";

export const listProjetos = async (params) => {
  let url = `projetos${params}`;
  return _get(url);
}

export const createProjeto = async (data) => {
  let url = 'projetos';
  return _post(url, data);
}

export const updateProjeto = async (id, data) => {
  let url = `projetos/${id}`;
  return _put(url, data);
}

export const deleteProjeto = async (id) => {
  let url = `projetos/${id}`;
  return _delete(url);
}