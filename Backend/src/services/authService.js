import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SECRET = process.env.JWT_SECRET || 'guitarra21';

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Nenhum usuário com esse email cadastrado!');
    error.statusCode = 401;
    throw error;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Senha incorreta');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
};