import BookModel from '../book/book.model';
import UserModel from '../auth/auth.model';
import RequestBookModel from './requestBook.model';

export const getAllRequestBook = async (req, res) => {
  const { sort, student, state = 'requested,returned' } = req.query;

  let resolveSort: any = { id: 'desc' };
  let resolveState;

  if (sort) {
    const arrSort: string = sort.split(':'); // => id:desc
    const key: string = arrSort[0];
    const value: string = arrSort[1];
    resolveSort = { [key]: value }; // => { id: 'desc' }
  }

  if (state) {
    resolveState = state.split(',');
  } else {
    resolveState = ['requested', 'returned'];
  }

  const resolveStudent = {
    $and: [...(student ? [{ userId: student }] : []), { state: resolveState }],
  };

  try {
    const books = await RequestBookModel.find(resolveStudent)
      .populate('bookId', ['title', 'author', 'publisher', 'image'])
      .populate('userId', ['firstName', 'lastName', 'email'])
      .sort(resolveSort);

    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const requestBook = async (req, res) => {
  const payload = req.body;

  if (!payload?.book || !payload?.student) {
    return res.status(400).json({
      code: 400,
      message: 'Bad Request',
    });
  }

  try {
    const findBook = await BookModel.findById(payload.book);
    if (findBook && findBook?.stockAvailable === 0) {
      return res.status(400).json({
        code: 400,
        message: 'Book is not available',
      });
    }

    // creating request book
    const reqBook = await RequestBookModel.create({
      bookId: payload.book,
      userId: payload.student,
    });

    if (reqBook) {
      // updating book available stock
      await BookModel.findByIdAndUpdate(payload.book, {
        stockAvailable: findBook.stockAvailable - 1,
      });
    }

    return res.status(200).json({
      ...reqBook,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const returnBook = async (req, res) => {
  const payload = req.body;
  const { id } = req.params;

  if (!payload?.userId) {
    return res.status(400).json({
      code: 400,
      message: 'Bad Request',
    });
  }

  try {
    const reqBook = await RequestBookModel.findById(id);
    if (reqBook?.state === 'returned') {
      return res.status(400).json({
        code: 400,
        message: 'Book is already returned',
      });
    }

    const user = await UserModel.findById(payload.userId);
    if (!user && user?.role !== 'librarian') {
      return res.status(400).json({
        code: 400,
        message: 'Not authorized to return',
      });
    }

    await reqBook.update({
      state: 'returned',
      returnDate: new Date(),
    });

    if (reqBook) {
      const book = await BookModel.findById(reqBook.bookId);
      const newBookAvailableStock = book.stockAvailable + 1;
      // updating book available stock
      await BookModel.findByIdAndUpdate(reqBook.bookId, {
        stockAvailable:
          newBookAvailableStock < book.stockBuy
            ? newBookAvailableStock
            : book.stockBuy,
      });
    }

    return res.status(200).json({
      code: 200,
      message: 'Book returned successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};
