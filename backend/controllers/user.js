const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const {SECRET} = require('../config/index');

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

            res.status(201).send(savedUser);
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
            res.status(400).json({ 
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

module.exports = {signup, login, logout};