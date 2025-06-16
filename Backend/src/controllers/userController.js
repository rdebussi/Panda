import * as userService from '../services/userService.js'

export const getAllUsers = async (_, res) => {
  try {
    const users = await userService.findAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const createUser = async (req, res) => {
  try {
      await userService.createUser(req.body);
      res.status(200).json({success: true, message: 'Conta criada com sucesso! Faça login.'})
  }   catch(e) {
      res.status(400).json({ error: e.message})
  }
}

