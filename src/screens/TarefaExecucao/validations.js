import * as yup from 'yup';

export const tarefaExecucaoSchema = yup.object().shape({
  tarefa_id: yup
    .string()
    .required('A tarefa é obrigatória.'),
  colaborador_id: yup
    .string()
    .required('O colaborador é obrigatório.'),
  inicio_execucao: yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/,
      'A data e hora de início deve estar no formato YYYY-MM-DDTHH:mm:ss.'
    )
    .required('O início da execução é obrigatório.'),
  fim_execucao: yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/,
      'A data e hora de fim deve estar no formato YYYY-MM-DDTHH:mm:ss.'
    )
    .notRequired(),
});
