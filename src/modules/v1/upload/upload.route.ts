import express from 'express';
import uploadMiddleware from '../../../middlewares/upload';
import verifyAuth from '../../../middlewares/auth';

import { uploadAsset, getImage, } from './upload.controller';

const router = express.Router();

router.post('/upload', verifyAuth, uploadMiddleware.single('file'), uploadAsset);
router.get('/:fileName', getImage);

export default router;

