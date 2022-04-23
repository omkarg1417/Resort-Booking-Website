const {org_domain} = require('../config/index');
const {verifyDomain} = require('../utils/validateAdmin');

const adminRegisterCheck = (req, res, next) => {

    const {email} = req.body;

    if(email.search("@" + org_domain) != -1) {
        next();
    } else{
        return res.status(400).json({
            message: "invalid admin email",
            success: false
        });
    }
    
}

module.exports = {adminRegisterCheck};