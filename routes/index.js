const router = require('express').Router();
const NotFoundInBase = require('../errors/NotFoundInBaseError');

const { login, createUser } = require('../controllers/user');
const { validateRegister, validateLogin } = require('../middlewares/routeValidators/routeValidators');

const routeUser = require('./user');
const routeMovies = require('./movies');

router.use(routeUser);
router.use(routeMovies);

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);

router.get('*', () => {
  throw new NotFoundInBase('Запрашиваемый ресурс не найден');
});

module.exports = router;
