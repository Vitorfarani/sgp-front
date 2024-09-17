import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";

export const tarefaExecucaoSchema = Yup.object().shape({
  colaborador: Yup.object()
    .required('Colaborador é obrigatório')
    .nonNullable(yupRequired('Colaborador')),
  tarefa: Yup.object()
    .required('Tarefa é obrigatória')
    .nonNullable(yupRequired('Tarefa')),
  projeto: Yup.object()
    .required('Projeto é obrigatório')
    .nonNullable(yupRequired('Projeto')),
  data_inicio_execucao: Yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/,
      'A data e hora de início deve estar no formato YYYY-MM-DDTHH:mm.'
    )
    .required('O início da execução é obrigatório.'),
  data_fim_execucao: Yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/,
      'A data e hora de fim deve estar no formato YYYY-MM-DDTHH:mm.'
    )
    .required('O fim da execução é obrigatório.'),
});
