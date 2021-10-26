const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  addMovie, deleteMovie, getMovies,
} = require('../controllers/movie');
const auth = require('../middlewares/auth');
const UrlValidation = require('../utils/UrlValidation');

router.get('/movies', auth, getMovies);

router.post('/movies', celebrate({
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
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
  }),
}), auth, addMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({ // Валидация параметра
    movieId: Joi.string().hex().length(24),
  }),
}), auth, deleteMovie);

module.exports = router;
