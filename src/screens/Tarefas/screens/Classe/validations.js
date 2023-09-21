import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";


export const tarefaClasseSchema = Yup.object().shape({
  nome: Yup.string().required( yupRequired('Nome')),
});

// export const tarefaSchema = Yup.object().shape({
//   nome: Yup.string().required('Nome é obrigatório'),
//   responsaveis: Yup.array().of(responsavelSchema),
//   conhecimentos: yupOptionStandart('Cliente'),
//   thumbnail: Yup.string(),
//   cliente: yupOptionStandart('Cliente'),
//   fase: yupOptionStandart(('Fase')),
//   situacao: yupOptionStandart('Classe'),
//   linkRepositorio: Yup.string(),
//   setor: yupOptionStandart('Gerencia'),
// });