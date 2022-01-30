const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/rateLimiter');

const centredErrors = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_DB_ADRESS } = require('./config');

const app = express();

const corsOption = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  credentials: true,
};

app.use(cors(corsOption));

mongoose.connect(MONGO_DB_ADRESS, {
});

app.use(requestLogger);// Подключения логгера запросов

app.use(rateLimiter);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allRoutes = require('./routes/index');

app.use(allRoutes);

app.use(errorLogger);// Подключения логгера ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(centredErrors);

app.listen(PORT, () => {
});
