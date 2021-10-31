const { celebrate, Joi } = require('celebrate');
const UrlValidation = require('../../utils/UrlValidation');

const validateRegister = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
});

const validatePostMovie = celebrate({
  body: Joi.object().keys({ // Валидация тела
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(UrlValidation),
    trailer: Joi.string().required().custom(UrlValidation),
    thumbnail: Joi.string().required().custom(UrlValidation),
    // movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({ // Валидация параметра
    movieId: Joi.string().hex().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({ // Валидация тела
    name: Joi.string(),
    email: Joi.string().email(),
  }),
});

module.exports = {
  validateRegister, validateLogin, validatePostMovie, validateDeleteMovie, validateUserUpdate,
};
