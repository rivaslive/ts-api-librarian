import express from 'express';
import {getAllUsers, getUserById, creteUser,updateUser, deleteUser,} from './user.controller';
import validateMiddleware from '../../../middlewares/validate';
import {
  createUserSchema, updateUserSchema,
  // LoginUserSchema,
} from './validate';
import  verifyAuth  from '../../../middlewares/auth';

const router = express.Router();

router.get('/', verifyAuth, getAllUsers);
router.get('/:userId', getUserById);
router.post('/', validateMiddleware(createUserSchema), creteUser);
router.put('/:userId', validateMiddleware(updateUserSchema), updateUser);
router.delete('/:userId', deleteUser);

export default router;
