import express from 'express';
import { getAllRequestBook, returnBook, requestBook, deleteRequestBook } from './requestBook.controller';
import  verifyAuth  from '../../../middlewares/auth';
import validateMiddleware from '../../../middlewares/validate';
import {createRequestBookSchema, ReturnBookSchema} from './requestBook.validate';

const router = express.Router();

router.get('/', verifyAuth, getAllRequestBook);
router.post('/', validateMiddleware(createRequestBookSchema), requestBook);
router.put('/:id', validateMiddleware(ReturnBookSchema), returnBook);
router.delete('/:requestId', deleteRequestBook);

export default router;
