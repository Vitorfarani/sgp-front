import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";

export const responsavelSchema = Yup.object().shape({
  responsavel: Yup.object().nonNullable(yupRequired('Responsável')),
  inicio: Yup.string().test('validDate', 'Data inválida', dateValidation).required('Data de início é obrigatória'),
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
export const setorSchema = Yup.object().shape({
  setor: Yup.object().nonNullable(yupRequired('Setor')),
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

export const projetoSchema = Yup.object().shape({
  id: Yup.number().nullable(),
  nome: Yup.string().required('Nome é obrigatório'),
  descricao: Yup.string().required(yupRequired('Descrição')),
  projeto_responsavel: Yup.array().when("id", (id, schema) => !id ? schema.of(responsavelSchema).min(1, 'É necessário no minimo 1 Responsável') : schema),
  projeto_setor: Yup.array().when("id", (id, schema) => !id ? schema.of(setorSchema).min(1, 'É necessário no minimo 1 setor') : schema),
  projeto_conhecimento: Yup.array().when("id", (id, schema) => !id ? schema.min(1, 'É necessário no minimo 1 conhecimento').required(yupRequired('Conhecimento')) : schema),
  thumbnail: Yup.string().nullable(),
  cliente: Yup.object().nonNullable(yupRequired('Cliente')),
  contato: Yup.object().nonNullable(yupRequired('Contato')),
  projeto_fase: Yup.object().nonNullable(yupRequired('Fase')),
  projeto_status: Yup.object().nonNullable(yupRequired('Status')),
  repositorio: Yup.string().nullable(),
  sei: Yup.string().required(yupRequired('SEI')),

  hml_ip: Yup.string().nullable(),
  hml_banco: Yup.string().nullable(),
  prod_ip: Yup.string().nullable(),
  prod_banco: Yup.string().nullable(),
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