const User = require('../models/user');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const {SECRET} = require('../config/index');
const {sendBookingMail} = require('./sendMail');
const Hotel = require('../models/hotel');

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(user){
            res.status(401).send("User already exist");
            console.log(email);
        }
        else{

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            const newUser = new User({
                name: name,
                email: email,
                password: hash
            });
            const savedUser = await newUser.save();

            res.status(200).send(savedUser);
        }
        
    } catch(err) {
        console.log("Signup Error: " + err);
        res.status(501).send("Signup Failed! something went wrong");
    }
}


const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where: {email}});
        //validate password
        const passCheck = await bcrypt.compare(password, user.password);
        if(!passCheck) {
            return res.status(400).json({ 
                message: "Enter valid email and password", 
                success: false 
            });
        }
        else{
            //create a token and store in cookie
            const token = jwt.sign({
                id: user.id,
            },
            SECRET,
            {
                expiresIn: '8h' 
            });

            res.cookie("token", token);

            const result = {
                id: user.id,
                name: user.name,
                email: user.email,
                token: `Bearer ${token}`,
                expiresIn: "1d",
            }

            res.status(200).json({
                ...result,
                message: "You are now logged in",
                success: true
            });
            
        }
    } catch(err) {
        console.log("Login error: " + err);
        res.status(500).send("Login failed! something went wrong");
    }
}

const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).send({
        message: "User logged out successfully"
    });
}

const getUserDetails = async (req, res) => {
    const id = req.id;
    try {
        const user = await User.findOne({_id: id});
        res.status(200).json({
            user
        });
    } catch(err) {
        console.log("ERROR", err);
        res.status(500).json({
            message: "something went wrong with getting user",
            error: err
        })
    }
}

const updateUser = async (req, res) => {
    const {name, email, password} = req.body;
    const id = req.id;
    try {
        
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const user = await User.findOne({_id:id});
        await User.updateOne({_id: id}, {name : (name)?name:user.name,
            email : (email)?email:user.email, password: (password)?hash:user.password});

        res.status(200).json({
            message: "User updates successfully"
        })
    } catch(err) {
        console.log("ERROR", err);
        res.status(500).json({
            message: "something went wrong with updating user",
            error: err
        })
    }
}

const deleteUser = async (req, res) => {
    const id = req.id;
    try{

        await User.deleteOne({_id: id});
        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            error:"something went wrong with deleting user"
        });
    }
}

//Hotel controllers
const bookResort = async (req, res) => {
    const hotelId = req.params['id'];
    const userId = req.id;
    const {checkInDate, checkOutDate, memberCount} = req.body;
    try{

        if(checkInDate <= new Date() || checkOutDate < checkInDate) {
            return res.status(400).json({
                error: "Invalid dates"
            });
        }
        const bookingObject = {
            user: userId,
            hotel: hotelId,
            checkInDate,
            checkOutDate,
            memberCount
        };
        
        const newBooking = new Booking(bookingObject);
        const savedBooking = await newBooking.save();

        const hotel = await Hotel.findOne({_id : hotelId});
        const user = await User.findOne({_id : userId});
        await sendBookingMail(user.email, hotel, {isBookingCreation: true});
        
        res.status(200).json({
            message: "Booking successful",
            booking: savedBooking
        });

    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            error: "Something went wrong while booking the resort"
        });
    }
    
}

const deleteBooking = async (req, res) => {
    const userId = req.id;
    const hotelId = req.params['id'];
    try {

        const booking = await Booking.deleteOne({
            user: userId,
            hotel: hotelId
        });

        const hotel = await Hotel.findOne({_id : hotelId});
        const user = await User.findOne({_id : userId});
        await sendBookingMail(user.email, hotel, {});
        
        res.status(200).json({
            message: "Booking cancelled successfully"
        });
        
    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            error: "Something went wrong while deleting the booking"
        });
    }
}

module.exports = {signup, login, logout, getUserDetails, updateUser, deleteUser, bookResort, deleteBooking};