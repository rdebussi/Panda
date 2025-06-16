import { Router } from 'express';
import * as folderController from '../controllers/folderController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.use(auth)
router.get('/folders', folderController.getAllFolders);
router.get('/folders/root', folderController.getRootFolders);
router.get('/folders/:id', folderController.getFolderById);

export default router;