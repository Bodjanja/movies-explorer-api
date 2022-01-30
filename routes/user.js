const router = require('express').Router();
const { validateUserUpdate } = require('../middlewares/routeValidators/routeValidators');
const {
  getOneUser, updateUser,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getOneUser);

router.patch('/users/me', validateUserUpdate, auth, updateUser);

module.exports = router;
