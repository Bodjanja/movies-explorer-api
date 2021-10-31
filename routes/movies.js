const router = require('express').Router();

const {
  addMovie, deleteMovie, getMovies,
} = require('../controllers/movie');
const auth = require('../middlewares/auth');
const { validatePostMovie, validateDeleteMovie } = require('../middlewares/routeValidators/routeValidators');

router.get('/movies', auth, getMovies);

router.post('/movies', validatePostMovie, auth, addMovie);

router.delete('/movies/:movieId', validateDeleteMovie, auth, deleteMovie);

module.exports = router;
