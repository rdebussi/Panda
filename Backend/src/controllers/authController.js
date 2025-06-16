import { authenticateUser } from '../services/authService.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const authData = await authenticateUser(email, password);
    return res.status(200).json(authData);

  } catch (error) {
    console.error('Erro no processo de login:', error.message);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};