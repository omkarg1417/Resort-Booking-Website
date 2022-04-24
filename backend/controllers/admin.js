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
        const admin = await Admin.findOne({email});
        if(admin){
            res.status(400).send("Admin already exist");
            ;
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

            res.status(201).send(savedAdmin);
        }
        
    } catch(err) {
        console.log("Signup Error: " + err);
        res.status(501).send("Signup Failed! something went wrong");
    }
}



const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const admin = await Admin.findOne({email});
        //validate password
        const passCheck = await bcrypt.compare(password, admin.password);
        if(!passCheck) {
            return res.status(400).json({ 
                message: "Enter valid email and password", 
                success: false 
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
                expiresIn: '8h' 
            });

            res.cookie("token", token);

            const result = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
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
        message: "Admin logged out successfully"
    });
}


const uploadHotelInfo = async (req, res) => {

    const {name, description, location, imageUrl, maxOccupancy, pricePerDay} = req.body;

    try {
        const hotel = await Hotel.findOne({name});
        if(hotel) {
            return res.status(400).json({
                message: "Hotel already exist with given name"
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
        res.status(201).send({savedHotel});
    }
    catch(err) {
        console.log('Hotel info upload error ' + err);
        res.status(501).send("Hotel info upload failed! Something went wrong");
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
            message: "Not found"
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
        const hotel = await Hotel.findOne({_id:id});
        if(!hotel) {
            return res.status(404).json({
                message: "Not found"
            });
        }
        await Hotel.deleteOne({_id : id});
        
        res.status(200).json({
            message: "Hotel info deleted successfully"
        });
        
    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            error: "Something went wrong while deleting hotel info"
        });
    }
}

const getUserCount = async (req, res) => {
    try {

        const count = await User.countDocuments();

        res.status(200).json({
            userCount : count
        })

    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            error: "Something went wrong while getting user count"
        })
    }
}

module.exports = {signupAdmin, login, logout, uploadHotelInfo, getUserCount, updateHotelInfo, deleteHotelInfo};