import { Op } from '@sequelize/core';
import BookModel from '../book/book.model';
import UserModel from '../auth/auth.model';
import RequestBookModel from './requestBook.model';

export const getAllRequestBook = async (req, res) => {
  const { sort, state, student } = req.query;

  const internalState: any = state ?? {
    [Op.or]: ['requested', 'returned'],
  };

  const internalSort = sort ? sort.split(':') : ['id', 'DESC'];
  const whereParams = {
    [Op.and]: [
      ...(student
        ? [
            {
              userId: student,
            },
          ]
        : []),
      {
        state: internalState,
      },
    ],
  };

  try {
    const books = await RequestBookModel.findAll({
      order: [internalSort],
      where: whereParams,
      include: [
        'book',
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

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
    const findBook = await BookModel.findByPk(payload.book);
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
      await BookModel.update(
        {
          stockAvailable: findBook.stockAvailable - 1,
        },
        {
          where: {
            id: payload.book,
          },
        }
      );
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
    const reqBook = await RequestBookModel.findByPk(id);
    if (reqBook?.state === 'returned') {
      return res.status(400).json({
        code: 400,
        message: 'Book is already returned',
      });
    }

    const user = await UserModel.findByPk(payload.userId);
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
      const book = await BookModel.findByPk(reqBook.bookId);
      const newBookAvailableStock = book.stockAvailable + 1;
      // updating book available stock
      await BookModel.update(
        {
          stockAvailable:
            newBookAvailableStock < book.stockBuy
              ? newBookAvailableStock
              : book.stockBuy,
        },
        {
          where: {
            id: reqBook.bookId,
          },
        }
      );
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
