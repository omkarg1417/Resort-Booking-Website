require('dotenv').config();

module.exports = {
    app_port : process.env.PORT,
    mongo_uri : process.env.MONGOURI,
    org_domain : process.env.DOMAIN,
    SECRET : process.env.SECRET,
    email : process.env.EMAIL,
    password : process.env.PASSWORD
};