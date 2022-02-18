import mongoose from 'mongoose';
require('dotenv').config();

const SchemaAttendence = new mongoose.Schema({
    loggedIn:{
        type:Date,
        default:new Date(),
        required:true
    },
    loggedOut:{
        type:Date
    },
    hoursWorked:{
        type:String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Attendence',SchemaAttendence)
