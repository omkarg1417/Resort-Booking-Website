const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const {SECRET} = require('../config/index');


const signupAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const admin = await Admin.findOne({email});
        if(admin){
            res.status(401).send("Admin already exist");
            console.log(email);
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
            res.status(400).json({ 
                message: "Enter valid email and password", 
                success: false 
            });
        }
        else{
            //create a token and store in cookie
            const token = jwt.sign({
                id: admin.id,
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

module.exports = {signupAdmin, login, logout};