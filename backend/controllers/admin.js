const Hotel = require('../models/hotel');
const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const {SECRET} = require('../config/index');


const signupAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        if(!name || !email || !password) {
            return res.status(400).json({
                err: "Please enter the credentials",
            })
        }
        
        const admin = await Admin.findOne({email});
        if(admin){
            return res.status(400).json({
                err:"Admin already exist"
            });
        }
        else{

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            const newAdmin = new Admin({
                name: name,
                email: email,
                password: hash
            });
            const savedAdmin = await newAdmin.save();

            // res.status(201).send(savedAdmin);
            res.status(200).json({
                message: "Admin registered successfully",
                data: {savedAdmin}
            })
        }
        
    } catch(err) {
        console.log("Signup Error: " + err);
        res.status(500).json({
            err: "Signup Failed! something went wrong"
        });
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
        
        const admin = await Admin.findOne({email});
        //validate password
        const passCheck = await bcrypt.compare(password, admin.password);
        if(!passCheck) {
            return res.status(400).json({ 
                err: "Please enter valid email and password", 
            });
        }
        else{
            //create a token and store in cookie
            const token = jwt.sign({
                id: admin.id,
                role: 'admin'
            },
            SECRET,
            {
                expiresIn: '1d' 
            });

            res.cookie("token", token);

            const result = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                token: token,
                expiresIn: "1d",
            }

            res.status(200).json({
                ...result,
                message: "You are now logged in",
            });
            
        }
    } catch(err) {
        console.log("Login error: " + err);
        res.status(500).json({
            err: "Login failed! something went wrong"
        });
    }
}

const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).send({
        message: "Admin logged out successfully"
    });
}


const uploadHotelInfo = async (req, res) => {

    const {name, description, location, imageUrl, maxOccupancy, pricePerDay} = req.body;

    try {
        const hotel = await Hotel.findOne({name});
        if(hotel) {
            return res.status(400).json({
                err: "Hotel already exist with given name"
            });
        }
        const newHotel = new Hotel({
            name,
            description,
            location,   
            imageUrl,
            maxOccupancy,
            pricePerDay
        });
        const savedHotel = await newHotel.save();
        res.status(201).json({
            data: {savedHotel},
            message: `Hotel ${name} saved successfully`
        });
    }
    catch(err) {
        console.log('Hotel info upload error ' + err);
        res.status(501).json({
            err: "Hotel info upload failed! Something went wrong"
        });
    }
    
};

const updateHotelInfo = async (req, res) => {
    const {id} = req.params;
    const {name, description, location, imageUrl, maxOccupancy, pricePerDay} = req.body;

    const hotel = await Hotel.findByIdAndUpdate(
        id,
        {name, description, location, imageUrl, maxOccupancy, pricePerDay},
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
        );

    if(!hotel) {
        return res.status(404).json({
            err: "Hotel not found"
        });
    }
    
    res.status(200).json({
        message: "Hotel info updated successfully",
        data: {hotel}
    });
    
}

const deleteHotelInfo = async (req, res) => {
    const id = req.params['id'];
    try {
        const hotel = await Hotel.findById(id);
        if(!hotel) {
            return res.status(404).json({
                err: "Hotel not found"
            });
        }
        // await Hotel.deleteOne({_id : id});

        await hotel.remove();
        
        res.status(200).json({
            message: "Hotel info deleted successfully"
        });
        
    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            err: "Something went wrong while deleting hotel info"
        });
    }
}

const getUserCount = async (req, res) => {
    try {

        const count = await User.countDocuments();

        res.status(200).json({
            data: {count}
        })

    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            err: "Something went wrong while getting user count"
        })
    }
}

const getAdminDetails = async (req, res) => {
    // const id = req.id;
    const {id} = req.params;
    try {
        const admin = await Admin.findOne({_id: id});
        res.status(200).json({
            message: "success",
            data : {admin}
        });
    } catch(err) {
        console.log("ERROR", err);
        res.status(500).json({
            err: "Get user failed",
            error: err
        });
    }
}

module.exports = {signupAdmin, login, logout, uploadHotelInfo, getUserCount, updateHotelInfo, deleteHotelInfo, getAdminDetails};