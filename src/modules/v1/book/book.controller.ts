import { Op } from '@sequelize/core';
import BookModel from './book.model';

export const getAllBooks = async (req, res) => {
  const { offset, limit, sort, search } = req.query;

  const internalSort = sort ? sort.split(':') : ['id', 'DESC'];

  const whereOptions = search
    ? {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            gender: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            author: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      }
    : undefined;

  try {
    const books = await BookModel.findAll({
      limit,
      offset,
      order: [internalSort],
      where: whereOptions,
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

export const getBookById = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await BookModel.findByPk(bookId);

    if (!book) {
      return res.status(404).json({
        code: 404,
        message: 'Record not found',
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const createBook = async (req, res) => {
  const payload = req.body;

  if (
    !payload?.gender ||
    !payload?.author ||
    !payload?.stockBuy ||
    !payload?.title ||
    !payload?.image ||
    !payload?.yearPublished
  ) {
    return res.status(400).json({
      code: 400,
      message: 'Bad Request',
    });
  }

  try {
    const book = await BookModel.create({
      stockAvailable: payload.stockBuy,
      ...payload,
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const updateBook = async (req, res) => {
  const payload = req.body;
  const { bookId } = req.params;

  if (!payload) {
    return res.status(400).json({
      code: 400,
      message: 'Bad Request',
    });
  }

  try {
    const book = await BookModel.findByPk(bookId);

    if (!book) {
      return res.status(404).json({
        code: 404,
        message: 'Record not found',
      });
    }

    try {
      let newAvailable = payload?.stockAvailable;

      if (payload?.stockBuy && !newAvailable) {
        const isMayorToDB = payload.stockBuy > book.stockBuy;
        newAvailable = isMayorToDB
          ? book.stockAvailable + (payload.stockBuy - book.stockBuy)
          : book.stockAvailable - (book.stockBuy - payload.stockBuy);
      }

      await book.update({
        ...payload,
        stockAvailable: newAvailable,
      });
      return res.status(200).json(book);
    } catch (e) {
      return res.status(500).json({
        code: 500,
        message: 'Error the update record',
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const deleteBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await BookModel.destroy({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      return res.status(404).json({
        code: 404,
        message: 'Record not found',
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};
