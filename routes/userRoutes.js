const {
  register,
  login,
  setProfile,
} = require('../controllers/usersController');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile/:id', setProfile);

module.exports = router;
