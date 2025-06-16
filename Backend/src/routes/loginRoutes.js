import express from 'express';
import { login } from '../controllers/authController.js';

import { validate } from '../middleware/validator.js';
import { loginSchema } from '../validators/authSchema.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);

export default router;