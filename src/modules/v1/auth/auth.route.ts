import express from 'express';
import { signIn } from './auth.controller';

const router = express.Router();

router.post('/signIn', signIn);

export default router;
