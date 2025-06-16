import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { userCreationSchema } from '../validators/authSchema.js';

const router = Router();

router.get('/users', auth, userController.getAllUsers);
router.post('/users', validate(userCreationSchema), userController.createUser);


export default router;