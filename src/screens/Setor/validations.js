import * as Yup from 'yup';
import { yupRequired } from "@/utils/helpers/yup";

export const setorSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
  sigla: Yup.string().required( yupRequired('Sigla')),
  responsavel_list: Yup.string().required( yupRequired('Responsável')),
  setor_list: Yup.string().required( yupRequired('Subordinação')),
});
