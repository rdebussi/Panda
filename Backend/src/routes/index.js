import { Router } from 'express';
import userRoutes from './userRoutes.js';
import loginRoutes from './loginRoutes.js';
import videoRoutes from './videoRoutes.js';
import folderRoutes from './folderRoutes.js'; 


const routes= Router();

routes.use('/',  userRoutes);
routes.use('/', loginRoutes);
routes.use('/', videoRoutes);
routes.use('/', folderRoutes); 



export default routes