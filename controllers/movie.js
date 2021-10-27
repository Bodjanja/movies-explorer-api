/* eslint-disable object-curly-newline */
const Movie = require('../models/movie');
const {
  STATUS_OK, STATUS_CREATED,
} = require('../utils/statuses');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');
const NotFoundInBase = require('../errors/NotFoundInBaseError');
const WrongUser = require('../errors/WrongUser');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ })
    .then((movie) => res.status(STATUS_OK).send({ data: movie }))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  // eslint-disable-next-line max-len
  const { country, director, duration, year, description, image, trailer, nameRu, nameEn, thumbnail } = req.body;
  const owner = req.user._id;
  const movieId = res.data._id;
  // eslint-disable-next-line object-curly-newline
  // eslint-disable-next-line max-len
  Movie.create({ country, director, duration, year, description, image, trailer, nameRu, nameEn, thumbnail, owner, movieId })
    .then((movie) => res.status(STATUS_CREATED).send({ data: movie }))
    .catch((err) =>
    // eslint-disable-next-line brace-style
    {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные в методы создания фильма'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // eslint-disable-next-line consistent-return
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotFoundInBase'))
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.status(STATUS_OK).send({ message: 'Фильм удалён' });
          });
      } return next(WrongUser('Не ваш фильм'));
    })
    .catch((err) => {
      if (err.message === 'NotFoundInBase') {
        next(new NotFoundInBase('Фильма нет в базе данных'));
      } else if (err.name === 'CastError') {
        next(new CastError('Некорректный ID фильма'));
      } else { next(err); }
    });
};
