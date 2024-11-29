import * as Yup from 'yup';
import { yupRequired } from "@/utils/helpers/yup";

export const setorSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
  sigla: Yup.string().required( yupRequired('Sigla')),
  responsavel: Yup.object().nullable(),
  setor: Yup.object().nullable(),
  // dataInicio: Yup.date().required('A data de início é obrigatória'),
  // dataFim: Yup
  // .date()
  // .min(Yup.ref('dataInicio'), 'A data de fim deve ser posterior à data de início'),
});
