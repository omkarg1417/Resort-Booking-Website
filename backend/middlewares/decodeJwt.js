const jwt = require('jsonwebtoken');
const {SECRET}=require('../config/index');

const decodeJwt = (req, res, next) => {
    const decoded = jwt.verify(req.cookies.token, SECRET);
    req.id = decoded.id;
    next();
}

module.exports = decodeJwt;