const Hotel = require('../models/hotel');

const getHotelInfo = async (req, res) => {
    const id = req.params['id'];

    try {
        const hotel = await Hotel.findOne({_id:id});
        res.status(200).json({
            hotelInfo: hotel
        })
    } catch{
        console.log('Hotel info get error ' + err);
        res.status(501).send("Hotel info get failed! Something went wrong");
    }
    
};

const getHotels = async (req, res) => {
    const location = req.query.location;
    try {
        
        const hotel = await Hotel.find({location});
        if(!hotel.size()) {
            return res.status(400).json({
                message: "No hotel found"
            })
        }
        res.status(200).json({
            hotels: hotel
        });
        
    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            error: "Something went wrong while finding hotels"
        })
    }
}

module.exports = {getHotelInfo, getHotels};