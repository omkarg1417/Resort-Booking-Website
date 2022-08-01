const express = require('express');
const router = express.Router();
const {registerInitialCheck} = require('../middlewares/registerInitialChecks');
const {loginChecks, isLoggedIn, isUser} = require('../middlewares/loginChecks');
const {signup, login, logout, getUserDetails, updateUser, deleteUser, bookResort, deleteBooking} = require('../controllers/user');
const {getHotelInfo, getHotels} = require('../controllers/hotel')


// Basic User routes
router.post('/signup', registerInitialCheck, signup);

router.post('/login', loginChecks, login);

router.get('/logout', logout);


// Authenticated User routes
router.get('/get-user/:id', getUserDetails);

router.put('/update-user', [isLoggedIn, isUser], updateUser);

router.delete('/delete-user', [isLoggedIn, isUser], deleteUser);


//Hotel routes
router.get('/get-hotels', getHotels);

router.get('/get-hotel-info/:id', getHotelInfo);


//Authenticated Hotel routes
router.post('/book-hotel/:id', [isLoggedIn, isUser],  bookResort);

//ADD AN EDIT BOOKING ROUTE

router.delete('/delete-booking/:id', [isLoggedIn, isUser], deleteBooking);

//ADD Payment route

module.exports = router;