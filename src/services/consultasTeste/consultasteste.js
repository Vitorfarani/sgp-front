import axios from "axios";
import { _delete, _get, _post, _put } from "..";

export const listColaboradorProjetosTarefatTeste= async (params = "") => {
    let url = `tarefa-execucao/colaboradorProjetosTarefaTeste${params}`;
    return _get(url);
  }

export const listProjetoColaboradoresTarefaTeste= async (params = "") => {
  let url = `tarefa-execucao/projetoColaboradoresTarefaTeste${params}`;
  return _get(url);
}


