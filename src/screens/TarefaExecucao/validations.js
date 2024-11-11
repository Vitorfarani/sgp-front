import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";

const currentDate = new Date();

export const tarefaExecucaoSchema = Yup.object().shape({
  colaborador: Yup.object()
    .required('Colaborador é obrigatório')
    .nonNullable(yupRequired('Colaborador')),
  tarefa: Yup.object()
    .required('Tarefa é obrigatória')
    .nonNullable(yupRequired('Tarefa')),
  data_inicio_execucao: Yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/,
      'A data e hora de início deve estar no formato YYYY-MM-DDTHH:mm.'
    )
    .required('O início da execução é obrigatório.')
    .test('not-in-future', 'A data e hora de início não pode estar no futuro.', value => {
      return new Date(value) <= currentDate;
    }),
    data_fim_execucao: Yup
    .string()
    .nullable() // Permite valores nulos
    .transform((value, originalValue) => originalValue.trim() === '' ? null : value) // Converte strings vazias em null
    .test('format', 'A data e hora de fim deve estar no formato YYYY-MM-DDTHH:mm.', value => {
      return !value || /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(value);
    })
    .test('not-in-future', 'A data e hora de fim não pode estar no futuro.', value => {
      return !value || Date.parse(value) <= Date.now();
    }),
  
});
