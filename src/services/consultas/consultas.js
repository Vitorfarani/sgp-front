import { _delete, _get, _post, _put, fakeFetch } from "..";


export const listConsultaConhecimentoByColaborador = async (params = "") => {
  let url = `dashboard/conhecimentoByColaborador${params}`;
  return _get(url);
}

