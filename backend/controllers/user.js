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
        if(!name || !email || !password) {
            return res.status(400).json({
                err : "Please enter required credentials"
            });
        }
        const user = await User.findOne({email});
        if(user){
            res.status(400).json({
                err: "User already registered"
            });
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
        res.status(500).json({
            err : "Signup failed! something went wrong",
        })
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({
                err: "Please enter email and password"
            });
        }
        const user = await User.findOne({email});
        //validate password
        const passCheck = await bcrypt.compare(password, user.password);
        if(!passCheck) {
            return res.status(400).json({ 
                err: "Enter valid email and password", 
            });
        }
        else{
            //create a token and store in cookie
            const token = jwt.sign({
                id: user.id,
                role: 'user'
            },
            SECRET,
            {
                expiresIn: '8h' 
            });

            res.cookie("token", token, {
                expires: new Date(
                  Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
              });

            const result = {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token,
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
        res.status(500).json({
            err : "Login Failed",
        });
    }
}

const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).send({
        message: "User logged out successfully"
    });
}

const getUserDetails = async (req, res) => {
    // const id = req.id;
    const {id} = req.params;
    try {
        const user = await User.findOne({_id: id});
        res.status(200).json({
            message: "success",
            data : {user}
        });
    } catch(err) {
        console.log("ERROR", err);
        res.status(500).json({
            err: "Get user failed",
            error: err
        });
    }
}

const updateUser = async (req, res) => {
    const {name, email, password} = req.body;
    const id = req.id;

    

    // const user = await User.findOne({_id:id});
    // await User.updateOne({_id: id}, {
    //     name : (name)?name:user.name,
    //     email : (email)?email:user.email, 
    //     password: (password)?hash:user.password
    // });

    const user = await User.findOneAndUpdate(
        id,
        {name, email, password},
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    );

    if(!user) {
        res.status(404).json({
            message: "User not found",
            err
        })
    }
    
    res.status(200).json({
        message: "User updated successfully",
        data: {user}
    })
    
}

const deleteUser = async (req, res) => {
    const id = req.id;
    try{

        // await User.deleteOne({_id: id});

        const user = User.findById(id);

        if(!user) {
            res.status(404).json({
                err: "User not found",
            });
        }

        await user.remove();
        res.status(200).json({
            message: `User ${user.email} deleted successfully`
        });

    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            err:"something went wrong with deleting user",
        });
    }
}

const getDayDifference = (checkInDate, checkOutDate) => {
    // getting difference in date
    let date1 = new Date(checkInDate);
    let date2 = new Date(checkOutDate);
    const timeDifference = date2.getTime() - date1.getTime();
    const dayDifference = timeDifference/(1000*3600*24);
    return dayDifference;
}

//Hotel controllers
const bookResort = async (req, res) => {
    const hotelId = req.params['id'];
    const userId = req.id;
    const {checkInDate, checkOutDate, memberCount} = req.body;
    try{
        
        const hotel = await Hotel.findById({_id : hotelId});
        if(!hotel) {
            return res.status(400).json({
                err: "Hotel Not found"
            });
        }
        if((!checkInDate || !checkOutDate) || checkInDate <= new Date() || checkOutDate < checkInDate) {
            return res.status(400).json({
                err: "Invalid dates"
            });
        }
        if(hotel.maxOccupancy < memberCount) {
            return res.status(400).json({
                err: `Member count more than the ${hotel.maxOccupancy}`
            })
        }
        
        const price = getDayDifference(checkInDate, checkOutDate) * hotel.pricePerDay;
        
        const bookingObject = {
            user: userId,
            hotel: hotelId,
            checkInDate,
            checkOutDate,
            memberCount,
            price
        };
        
        const newBooking = new Booking(bookingObject);
        // console.log(newBooking);
        const savedBooking = await newBooking.save();

        
        const user = await User.findOne({_id : userId});
        await sendBookingMail(user, hotel, savedBooking, {isBookingCreation: true});


        
        await user.bookings.push(hotel._id.toString());
        
        await user.save();
        
        res.status(200).json({
            message: "Hotel booked successfully",
            data: {savedBooking}
        });

    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            err: "Something went wrong while booking the resort",
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
        await sendBookingMail(user, hotel, {});
        
        res.status(200).json({
            message: "Booking cancelled successfully"
        });
        
    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            err: "Something went wrong while deleting the booking",
        });
    }
}

module.exports = {signup, login, logout, getUserDetails, updateUser, deleteUser, bookResort, deleteBooking};