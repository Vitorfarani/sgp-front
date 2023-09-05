import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";

export const responsavelSchema = Yup.object().shape({
  responsavel: Yup.object().nonNullable('Responsável é obrigatória'),
  dataInicio: Yup.string().test('validDate', 'Data inválida', dateValidation).required('Data de início é obrigatória'),
  dataFim: Yup.string().test('validDate', 'Data inválida', dateValidation),
});

export const projetoSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  responsaveis: Yup.array().of(responsavelSchema),
  conhecimentos: Yup.array().min(1, yupRequired('Conhecimento')),
  thumbnail: Yup.string().nullable(),
  cliente: Yup.object().nonNullable(yupRequired('Cliente')).shape(yupOptionStandart('Cliente')),
  fase: Yup.object().nonNullable(yupRequired('Fase')).shape(yupOptionStandart('Fase')),
  situacao: Yup.object().nonNullable(yupRequired('Status')).shape(yupOptionStandart('Status')),
  linkRepositorio: Yup.string(),
  setor: Yup.object().nonNullable(yupRequired('Gerencia')).shape(yupOptionStandart('Gerencia')),
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
//   setor: yupOptionStandart('Gerencia'),
// });