const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    memberCount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps:true});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;