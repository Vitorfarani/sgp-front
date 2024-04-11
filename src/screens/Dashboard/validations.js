import * as Yup from 'yup';
import { dateValidation, yupOptionStandart, yupRequired } from "@/utils/helpers/yup";

export const dateSchema = Yup.object().shape({
    data_inicio: Yup.date().test('validDate', 'Data inválida', dateValidation)
    .nullable()
    .max(new Date(), 'A data não pode estar no futuro'),

    data_fim: Yup.date().test('validDate', 'Data inválida', dateValidation)
    .nullable()
    .max(new Date(), 'A data não pode estar no futuro')
    .when('data_inicio', (data_inicio, schema) => {
        if (data_inicio) {
            return schema.min(data_inicio, 'Fim não pode ser anterior a início');
        }
    })
});