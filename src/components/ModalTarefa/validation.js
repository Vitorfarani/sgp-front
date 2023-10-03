import { yupRequired } from '@/utils/helpers/yup';
import * as Yup from 'yup';

export const tarefaSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  projeto_id: Yup.number().integer().nullable(),
  tarefa_base: Yup.object().nonNullable(yupRequired('Base')),
  tarefa_status: Yup.object().nonNullable(yupRequired('Status')),
  tarefa_conhecimento: Yup.array().when("id", (id, schema) => !id ? schema.min(1, 'É necessário no minimo 1 conhecimento').required(yupRequired('Conhecimento')) : schema),
  nome: Yup.string().required(yupRequired('nome')).max(255, 'Máximo de 255 caracteres'),
  descricao: Yup.string().required(yupRequired('descricao')).max(2255),
  // dificuldade: Yup.string().max(45).nullable(),
  observacoes: Yup.array().nullable(),
  checklist: Yup.array().nullable(),
  // coeficiente: Yup.number().nullable().positive().max(999999.99),
  data_inicio_programado: Yup.date().nullable(),
  data_fim_programado: Yup.date().nullable(),
  data_inicio_real: Yup.date().nullable(),
  data_fim_real: Yup.date().nullable(),
  interrompido_at: Yup.date().nullable(),
  interrompido_motivo: Yup.date().nullable(),
  // order: Yup.number().required().integer(),
  // tempo_determinado: Yup.number().required().integer(),
});

