import { Router } from 'express';
import * as videoController from '../controllers/videoController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';
import { videoUpdateSchema } from '../validators/videoSchema.js';

const router = Router();

router.use(auth)
router.get('/videos', videoController.getAllVideos);
router.get('/videos/:id', videoController.getVideoById);
router.put('/videos/:id', validate(videoUpdateSchema) ,videoController.updateVideo)

export default router;