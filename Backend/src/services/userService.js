import User from '../models/User.js';

export const findAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return users;
  } catch (error) {
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }
}

export const createUser = async (data) => {
  const { email } = data;
  console.log(data, ' - ', email )
  const existingEmail = await User.findOne({where: {email}})
  if (existingEmail) throw new Error('Este email já está vinculado a uma conta!')
  const user = await User.create(data)
  if(user) return true
  return false
}