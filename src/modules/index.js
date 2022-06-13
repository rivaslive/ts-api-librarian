import express from 'express';
import authRoutes from './v1/auth/auth.route';
import bookRoutes from './v1/book/book.route';
import userRoutes from './v1/user/user.route';
import requestBookRoutes from './v1/requestBook/requestBook.route';
import publicRoutes from './v1/upload/upload.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/requestBooks', requestBookRoutes);
router.use('/public', publicRoutes);

export default router;
