const {
  register,
  login,
  setProfile,
  getAllUsers,
} = require('../controllers/usersController');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile/:id', setProfile);
router.get('/allUsers/:id', getAllUsers);

module.exports = router;
