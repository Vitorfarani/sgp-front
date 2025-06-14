import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";
import { validarCpf } from '@/utils/helpers/validators';

export const vinculoSchema = Yup.object().shape({
  data_inicio: Yup.string().nullable().test('validDate', 'Data inválida', dateValidation),
  data_fim: Yup.string().nullable().test('validDate', 'Data inválida', dateValidation),
  empresa: Yup.object().nullable(),
  funcao: Yup.object().nullable(),
  carga_horaria: Yup.number(),
});

export const colaboradorSchema = Yup.object().shape({
  nome: Yup.string().required(yupRequired('Nome')),
  cpf: Yup.string().required(yupRequired('CPF')).test(
    'cpf',
    'CPF inválido',
    (cpf) =>  !!cpf ? validarCpf(cpf) : true),
  email: Yup.string().email('Formato de email inválido').required(yupRequired('Email')),
  telefone: Yup.string().required(yupRequired('Telefone')),
  pr: Yup.string().required(yupRequired('PR')),
  setor: Yup.object().nonNullable(yupRequired('Setor')),
  nascimento: Yup.string().required(yupRequired('Data de nascimento')).test('validDate', 'Data inválida', dateValidation),
  vinculo: vinculoSchema
});

export const conhecimentoSchema = Yup.object().shape({
  conhecimento: Yup.object().nonNullable(yupRequired('Conhecimento')),
  conhecimento_nivel: Yup.object().nonNullable(yupRequired('Nível de conhecimento')),
});
