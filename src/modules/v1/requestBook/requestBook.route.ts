import express from 'express';
import { getAllRequestBook, returnBook, requestBook } from './requestBook.controller';

const router = express.Router();

router.get('/', getAllRequestBook);
router.post('/', requestBook);
router.put('/:id', returnBook);

export default router;
