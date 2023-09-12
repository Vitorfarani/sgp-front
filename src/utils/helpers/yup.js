import moment from 'moment';
import * as Yup from 'yup';

export async function validateSchema(validationSchema, formData) {
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return Promise.resolve();
  } catch (validationErrors) {
    const newErrors = {};
    if(validationErrors === 'Cpf inválido') {
      newErrors['cpf'] = 'Cpf inválido';
      return Promise.reject(newErrors);
    }
    validationErrors.inner.forEach(error => {
      newErrors[error.path] = error.message;
    });
    return Promise.reject(newErrors);
  }
}

export function dateValidation (originalValue) {
  if(originalValue == '' || originalValue == null) return true
  return moment(originalValue, 'YYYY-MM-DD', true).isValid();
};

export const yupDateStandart =  Yup.string().test('date', 'Data inválida', dateValidation)

export const yupRequired = (name) => name+' é obrigatório(a)'
export const yupPhoneRegex = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
export const yupOptionStandart = (name) => ({
  value: Yup.number().required('ID da '+name+' é obrigatório(a)'),
  label: Yup.string().required('Nome da '+name+' é obrigatório(a)'),
})

