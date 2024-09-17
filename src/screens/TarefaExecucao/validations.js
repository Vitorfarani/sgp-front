import * as yup from 'yup';

export const tarefaExecucaoSchema = yup.object().shape({
  tarefa_id: yup
    .string()
    .required('A tarefa é obrigatória.'),
  colaborador_id: yup
    .string()
    .required('O colaborador é obrigatório.'),
  data_inicio_execucao: yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/,
      'A data e hora de início deve estar no formato YYYY-MM-DDTHH:mm:ss.'
    )
    .required('O início da execução é obrigatório.'),
  data_fim_execucao: yup
    .string()
    .matches(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/,
      'A data e hora de fim deve estar no formato YYYY-MM-DDTHH:mm:ss.'
    )
    .required('O fim da execução é obrigatório.')
    .test(
      'is-greater',
      'A data de fim deve ser igual ou posterior à data de início.',
      function (value) {
        const { data_inicio_execucao } = this.parent;
        return !data_inicio_execucao || !value || new Date(value) >= new Date(inicio_execucao);
      }
    ),
});
