const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getOneUser, updateUser,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getOneUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({ // Валидация тела
    name: Joi.string(),
    email: Joi.string().email(),
  }),
}), auth, updateUser);

module.exports = router;
