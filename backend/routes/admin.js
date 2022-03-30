const express = require('express');
const router = express.Router();

const {registerInitialCheck} = require('../middlewares/registerInitialChecks');
const {adminRegisterCheck} = require('../middlewares/adminRegisterCheck')
const {signupAdmin, login, logout} = require('../controllers/admin');

router.post('/signup',registerInitialCheck, adminRegisterCheck, signupAdmin);

router.post('/login', login);

router.post('/logout', logout);


module.exports = router;