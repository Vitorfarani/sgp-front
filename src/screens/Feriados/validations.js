import * as Yup from 'yup';
import { dateValidation } from "@/utils/helpers/yup";


export const feriadoSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  data: Yup.string().test('validDate', 'Data inválida', dateValidation).required('Data é obrigatória'),
  tipo: Yup.string().required('Tipo é obrigatório')
});