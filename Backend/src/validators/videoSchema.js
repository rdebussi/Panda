import * as yup from 'yup';

export const videoUpdateSchema = yup.object({
  title: yup
    .string()
    .max(255, 'O título não pode exceder 255 caracteres.'),
  description: yup
    .string()
    .nullable()
    .max(5000, 'A descrição não pode exceder 5000 caracteres.')
});