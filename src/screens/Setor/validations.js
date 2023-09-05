import * as Yup from 'yup';
import { yupRequired } from "@/utils/helpers/yup";

export const setorSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
  email: Yup.string().email('Formato de email inválido').required( yupRequired('Email')),
  telefone: Yup.string().required( yupRequired('Telefone')),
  responsavel: Yup.string().required( yupRequired('Responsável')),
});
