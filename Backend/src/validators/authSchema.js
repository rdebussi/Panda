import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('O email deve ter um formato válido')
    .required('O campo email é obrigatório'),
  password: yup
    .string()
    .required('O campo senha é obrigatório'),
});


export const userCreationSchema = yup.object({
    username: yup
      .string()
      .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres')
      .required('O campo nome de usuário é obrigatório'),
    email: yup
      .string()
      .email('O email deve ter um formato válido')
      .required('O campo email é obrigatório'),
    password: yup
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('O campo senha é obrigatório'),
  });
  