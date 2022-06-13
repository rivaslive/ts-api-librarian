import Joi from 'joi';

export const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  image: Joi.string().required(),
  gender: Joi.string().required(),
  yearPublished: Joi.string().required(),
  stockBuy: Joi.number().required()
    .error((errors:any) => {
      errors.forEach((err) => {
        if (err.code === 'any.required') {
          err.message = 'Por favor ingrese todos los campos!';
        }
      });
      return errors;
    }),
});

export const updateBookSchema = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  image: Joi.string(),
  gender: Joi.string(),
  yearPublished: Joi.string(),
}).or('title', 'author', 'image', 'gender', 'yearPublished');
