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
    image: {
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
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;