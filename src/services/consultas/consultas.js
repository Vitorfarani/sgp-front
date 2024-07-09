import axios from "axios";
import { _delete, _get, _post, _put, fakeFetch } from "..";

export const listConhecimentoByColaborador = async (params = "") => {
  let url = `dashboard/conhecimentoByColaborador${params}`;
  return _get(url);
}


export const listProjetoBySetorCliente = async (params = "") => {
  let url = `dashboard/projetoBySetorCliente${params}`;
  return _get(url);
}


export const listColaboradorProjetosTarefa = async (params = "") => {
  let url = `dashboard/colaboradorProjetosTarefa${params}`;
  return _get(url);
}

export const listProjetoColaboradoresTarefa = async (params = "") => {
  let url = `dashboard/projetoColaboradoresTarefa${params}`;
  return _get(url);
}

export const listTarefasPorAgrupamento = async (params = "") => {
  let url = `dashboard/tarefasAgrupadasColaboradorPrazos${params}`;
  return _get(url);
}

export const listColaboradorProjetosStatusTarefa = async (params = "") => {
  let url = `dashboard/colaboradorProjetosStatusTarefa${params}`;
  return _get(url);
}

export const listColaboradorHorasTrabalhadas = async (params = "") => {
  let url = `dashboard/colaboradorHorasTrabalhadas${params}`;
  return _get(url);
}