const express = require('express');
const router = express.Router();

const {registerInitialCheck} = require('../middlewares/registerInitialChecks');
const {loginChecks, isLoggedIn} = require('../middlewares/loginChecks');
const {adminRegisterCheck} = require('../middlewares/adminRegisterCheck')
const {signupAdmin, login, logout, uploadHotelInfo, getUserCount, updateHotelInfo, deleteHotelInfo} = require('../controllers/admin');
const {getHotelInfo, getHotels} = require('../controllers/hotel');
const decodeJwt = require('../middlewares/decodeJwt');


//Basic Admin routes
router.post('/signup', [registerInitialCheck, adminRegisterCheck], signupAdmin);

router.post('/login', loginChecks, login);

router.get('/logout', logout);

//Hotel routes
router.get('/get-hotels/?location', getHotels);


//Authenticated Hotel routes
router.post('/upload-hotel-info', [decodeJwt, isLoggedIn], uploadHotelInfo);

router.get('/get-hotel-info/:id', [decodeJwt, isLoggedIn], getHotelInfo);

router.put('/update-hotel-info/:id', [decodeJwt, isLoggedIn], updateHotelInfo);

router.delete('/delete-hotel-info/:id', [decodeJwt, isLoggedIn], deleteHotelInfo);


//Authenticated User routes
router.get('/get-user-count', [decodeJwt, isLoggedIn], getUserCount);


module.exports = router;