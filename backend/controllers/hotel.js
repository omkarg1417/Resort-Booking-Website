const Hotel = require('../models/hotel');

const getHotelInfo = async (req, res) => {
    const id = req.params['id'];
    // console.log(id);
    try {
        const hotel = await Hotel.findOne({_id:id});
        if(!hotel) {
            return res.status(404).json({
                err: "Not Found"
            });
        }
        res.status(200).json({
            data: {hotel}
        })
    } catch(err){
        console.log('Hotel info get error ' + err);
        res.status(501).json({
            message : "Hotel info get failed",
            err
        });
    }
    
};

const getHotels = async (req, res) => {
    const {location} = req.query;
    try {
        
        const hotel = await Hotel.find({location});
        res.status(200).json({
            message: "success",
            data: {hotel}
        });
        
    } catch(err) {
        console.log("ERROR: ", err);
        res.status(500).json({
            err: "Something went wrong while finding hotels",
        });
    }
}

module.exports = {getHotelInfo, getHotels};