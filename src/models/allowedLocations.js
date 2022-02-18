import mongoose  from "mongoose";
require('dotenv').config();
const allowedLocationsSchema = new mongoose.Schema({
    latitude:{
        type:String,
        required:true,
    },
    longitude:{
        type:String,
        required:true,
    },
    radius:{
        type:String,
        required:true,
    },
})

const AllowedLocations= mongoose.model('allowedLocations',allowedLocationsSchema)
module.exports = AllowedLocations;