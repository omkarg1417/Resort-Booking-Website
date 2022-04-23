const mongoose = require('mongoose');
const {mongo_uri} = require('../config/index');


const connectToMongo = () => {
    mongoose.connect(mongo_uri, () => {
        console.log("----------CONNECTED TO DB----------");
    })
}

module.exports = connectToMongo;