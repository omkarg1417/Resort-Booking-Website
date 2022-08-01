const {isValidEmail} = require('../utils/validate');
const jwt = require('jsonwebtoken');
const {SECRET}=require('../config/index');

const loginChecks = (req, res, next) => {
    if(isValidEmail(req.body.email)) {
        next();
    }
    else{
        return res.status(400).json({
            err: "invalid email"
        });
    }
}

const isLoggedIn = (req, res, next) => {
    // console.log(req.cookies.token);
    // if(req.cookies.token === undefined) {
    // if(!req.body.auth || !req.cookies.token){
    if(!req.headers.auth) {
        return res.status(401).json({
            err: "Unauthorized"
        });
    }
    else{
        const decoded = jwt.verify(req.headers.auth, SECRET);
        req.id = decoded.id;
        req.role = decoded.role;
        // console.log(req.id, req.role);
    }
    next();
}

const isAdmin = (req, res, next) => {
    if(req.role==='admin') {
        next();
    } else{
        return res.status(401).json({
            err : "Unauthorized"
        });
    }
}

const isUser = (req, res, next) => {
    if(req.role==='user') {
        next();
    } else{
        return res.status(401).json({
            err : "Unauthorized role"
        });
    }
}

module.exports = {loginChecks, isLoggedIn, isAdmin, isUser};