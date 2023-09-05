import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";
import { validarCpf } from '@/utils/helpers/validators';

export const colaboradorSchema = Yup.object().shape({
  nome: Yup.string().required(yupRequired('Nome')),
  cpf: Yup.string().test(
    'test-invalid-cpf',
    'CPF inválido',
    (cpf) =>  validarCpf(cpf)).required(yupRequired('CPF')),
  email: Yup.string().email('Formato de email inválido').required(yupRequired('Email')),
  telefone: Yup.string().required(yupRequired('Telefone')),
  pr: Yup.string().required(yupRequired('PR')),
  setor: Yup.object().nonNullable(yupRequired('Setor')).shape(yupOptionStandart('Setor')),
  nascimento: Yup.date('Data de nascimento inválida').required(yupRequired('Data de nascimento')),
  // conhecimentos: Yup.array().min(1, yupRequired('Conhecimento')),
});
