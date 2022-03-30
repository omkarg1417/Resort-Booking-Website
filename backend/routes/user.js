const express = require('express');
const router = express.Router();
const {registerInitialCheck} = require('../middlewares/registerInitialChecks');
const {signup, login, logout} = require('../controllers/user');

router.post('/signup', registerInitialCheck, signup);

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;