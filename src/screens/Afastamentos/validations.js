import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";


export const afastamentoSchema = Yup.object().shape({
  colaborador: Yup.object().nonNullable( yupRequired('Colaborador')),
  tipo_afastamento : Yup.object().nonNullable( yupRequired('Tipo')),
  inicio: Yup.string().test('validDate', 'Data inválida', dateValidation).required('Data de início é obrigatória'),
  // fim: Yup.string().test('validDate', 'Data inválida', dateValidation).nullable(),

  fim: Yup.date().test('validDate', 'Data inválida', dateValidation)
  .nullable()
  .when('inicio', (data_inicio, schema) => {
    if (data_inicio[0] !== null) {
      return schema.min(
        data_inicio[0],
        'Fim não pode ser anterior a inicio'
      );
    }
  }),

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