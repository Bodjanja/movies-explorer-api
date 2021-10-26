const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_OK, STATUS_CREATED,
} = require('../utils/statuses');
const ValidationError = require('../errors/ValidationError');
const SameEmailError = require('../errors/SameEmailError');
const UnauthorizedLogin = require('../errors/UnauthorizedLogin');
// const CastError = require('../errors/CastError');
// const NotFoundInBase = require('../errors/NotFoundInBaseError');

const { JWT_SECRET = 'secret' } = process.env;

const opts = { // чтобы при обновлении пользователя сервер вернул новое значение объекта
  new: true,
  runValidators: true,
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(STATUS_CREATED).send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedLogin(err.message));
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(STATUS_CREATED).send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch((err) =>
    // eslint-disable-next-line brace-style
    {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new SameEmailError('Пользователь с таким email уже существует'));
      } else { next(err); }
    });
};

module.exports.getOneUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, email }, opts)
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) =>
    // eslint-disable-next-line brace-style
    {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при редактировании пользователя'));
      } else { next(err); }
    });
};
