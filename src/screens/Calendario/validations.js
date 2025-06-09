import * as Yup from "yup";

export const calendarioSchema = Yup.object().shape({
  title: Yup.string().required("O título é obrigatório"),
  date: Yup.string().required("A data é obrigatória"),
});
