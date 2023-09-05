import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";


export const clienteSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
  email: Yup.string().email('Formato de email inválido').required( yupRequired('Email')),
  telefone: Yup.string().required( yupRequired('Telefone')),
  responsavel: Yup.string().required( yupRequired('Responsável')),
});

// export const projetoSchema = Yup.object().shape({
//   nome: Yup.string().required('Nome é obrigatório'),
//   responsaveis: Yup.array().of(responsavelSchema),
//   conhecimentos: yupOptionStandart('Cliente'),
//   thumbnail: Yup.string(),
//   cliente: yupOptionStandart('Cliente'),
//   fase: yupOptionStandart(('Fase')),
//   situacao: yupOptionStandart('Status'),
//   linkRepositorio: Yup.string(),
//   gerencia: yupOptionStandart('Gerencia'),
// });