const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    maxOccupancy: {
        type: Number,
    },
    pricePerDay: {
        type: Number,
        required: true,
    }
}, {timestamps:true});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;