const express = require('express');
const router = express.Router();

const {registerInitialCheck} = require('../middlewares/registerInitialChecks');
const {loginChecks, isLoggedIn, isAdmin} = require('../middlewares/loginChecks');
const {adminRegisterCheck} = require('../middlewares/adminRegisterCheck');
const {signupAdmin, login, logout, uploadHotelInfo, getUserCount, updateHotelInfo, deleteHotelInfo, getAdminDetails} = require('../controllers/admin');
const {getHotelInfo, getHotels} = require('../controllers/hotel');


//Basic Admin routes
router.post('/signup', [registerInitialCheck, adminRegisterCheck], signupAdmin);

router.post('/login', loginChecks, login);

router.get('/logout', logout);

router.get('/get-admin/:id',[isLoggedIn, isAdmin], getAdminDetails);

//Hotel routes
router.get('/get-hotels/?location', getHotels);


//Authenticated Hotel routes
router.post('/upload-hotel-info', [isLoggedIn, isAdmin], uploadHotelInfo);

router.get('/get-hotel-info/:id', [isLoggedIn, isAdmin], getHotelInfo);

router.put('/update-hotel-info/:id', [isLoggedIn, isAdmin], updateHotelInfo);

router.delete('/delete-hotel-info/:id', [isLoggedIn, isAdmin], deleteHotelInfo);  


//Authenticated User routes
router.get('/get-user-count', [isLoggedIn, isAdmin], getUserCount);


module.exports = router;