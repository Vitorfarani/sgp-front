import * as Yup from 'yup';
import { yupRequired } from "@/utils/helpers/yup";

export const setorSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
  sigla: Yup.string().required( yupRequired('Sigla')),
  responsavel: Yup.object().nullable(),
  setor: Yup.object().nullable(),
});
