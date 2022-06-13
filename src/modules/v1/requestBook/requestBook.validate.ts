import Joi from 'joi';

export const createRequestBookSchema = Joi.object({
  book: Joi.string().required(),
  student: Joi.string().required()
    .error((errors:any) => {
      errors.forEach((err) => {
        if (err.code === 'any.required') {
          err.message = 'Por favor ingrese todos los campos!';
        }
      });
      return errors;
    }),
});

export const ReturnBookSchema = Joi.object({
  userId: Joi.string(),
  state: Joi.string(),
}).or('book', 'state',);
