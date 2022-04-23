const express = require('express');
const router = express.Router();
const {registerInitialCheck} = require('../middlewares/registerInitialChecks');
const {loginChecks, isLoggedIn} = require('../middlewares/loginChecks');
const {signup, login, logout, getUserDetails, updateUser, deleteUser, bookResort, deleteBooking} = require('../controllers/user');
const {getHotelInfo, getHotels} = require('../controllers/hotel')
const decodeJwt = require('../middlewares/decodeJwt');


// Basic User routes
router.post('/signup', registerInitialCheck, signup);

router.post('/login', loginChecks, login);

router.get('/logout', logout);


// Authenticated User routes
router.get('/get-user', [decodeJwt, isLoggedIn], getUserDetails);

router.put('/update-user', [decodeJwt, isLoggedIn], updateUser);

router.delete('/delete-user', [decodeJwt, isLoggedIn], deleteUser);


//Hotel routes
router.get('/get-hotels/?location', getHotels);

router.get('/get-hotel-info/:id', getHotelInfo);


//Authenticated Hotel routes
router.post('/book-hotel/:id', [decodeJwt, isLoggedIn],  bookResort);

//ADD AN EDIT BOOKING ROUTE

router.delete('/delete-booking/:id', [decodeJwt, isLoggedIn], deleteBooking);

//ADD Payment route

module.exports = router;