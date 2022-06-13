import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from './book.controller';
import { createBookSchema, updateBookSchema, } from './book.validate';
import  verifyAuth  from '../../../middlewares/auth';

import validateMiddleware from '../../../middlewares/validate';

const router = express.Router();

router.get('/', verifyAuth, getAllBooks);
router.post('/', validateMiddleware(createBookSchema), createBook);
router.get('/:bookId', getBookById);
router.put('/:bookId', validateMiddleware(updateBookSchema), updateBook);
router.delete('/:bookId', deleteBook);

export default router;

