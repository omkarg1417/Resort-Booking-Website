const {isValidEmail} = require('../utils/validate');

const loginChecks = (req, res, next) => {
    if(isValidEmail(req.body.email)) {
        next();
    }
    else{
        return res.status(400).json({
            message: "invalid email"
        });
    }
}

const isLoggedIn = (req, res, next) => {
    if(req.id) {
        next();
    } else{
        res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = {loginChecks, isLoggedIn};