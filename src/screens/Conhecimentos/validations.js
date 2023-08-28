import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";


export const conhecimentoSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
  descricao: Yup.string().required( yupRequired('Descrição')),
  dificuldade:  Yup.number().required(yupRequired('Dificuldade')),
  conhecimento_classe:  Yup.object().nonNullable(yupRequired('Classe')).shape(yupOptionStandart('Classe')),
  conhecimento_nivel: Yup.object().nullable(),
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