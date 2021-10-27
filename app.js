const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const NotFoundInBase = require('./errors/NotFoundInBaseError');
const centredErrors = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, createUser } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();

const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  credentials: true,
};

app.use(cors(corsOption));

const routeUser = require('./routes/user');
const routeMovies = require('./routes/movies');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
});

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);// Подключения логгера запросов

app.use(routeUser);
app.use(routeMovies);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.get('*', () => {
  throw new NotFoundInBase('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);// Подключения логгера ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(centredErrors);

app.listen(PORT, () => {
});
