import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string()
    .error((errors:any) => {
      errors.forEach((err) => {
        if (err.code === 'any.required') {
          err.message = 'Por favor ingrese todos los campos';
        }
      });
      return errors;
    }),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  role: Joi.string(),
}).or('firstName', 'lastName', 'email', 'password', 'role');
