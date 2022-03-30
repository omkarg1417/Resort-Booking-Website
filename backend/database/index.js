const mongoose = require('mongoose');
const {mongo_uri} = require('../config/index');
// const mongo_uri = "mongodb://localhost:27017/podcast";


const connectToMongo = () => {
    mongoose.connect(mongo_uri, () => {
        console.log("----------CONNECTED TO DB----------");
    })
}

module.exports = connectToMongo;