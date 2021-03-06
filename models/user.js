const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Задаём поведение по умолчанию, чтобы база данных не возвращала это поле
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
},
{
  versionKey: false,
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // eslint-disable-next-line no-undef
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Пароли не совпали'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
