import * as Yup from 'yup';

export const dateSchema = Yup.object().shape({
    data_inicio: Yup.string().ensure()
        .test('data_inicio', 'A data não pode estar no futuro', function(value) {
            const hoje = new Date().toISOString();
            if (value > hoje) {
                return false;
            }
            return true;
        }),

    data_fim: Yup.string().ensure().notRequired()
    .when(['data_inicio'], (data_inicio, schema) => {
        return schema.test({
            test: function(data_fim) {
                const hoje = new Date().toISOString();
                if (data_fim > hoje) {
                    return this.createError({ message: 'A data não pode estar no futuro', path: 'data_fim' });
                }
                if (data_fim && data_inicio && data_fim < data_inicio) {
                    return this.createError({ message: 'Fim não pode ser anterior a início', path: 'data_fim' });
                }
                return true;
            }
        });
    })
});

