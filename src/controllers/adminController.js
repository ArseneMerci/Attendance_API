
import User from '../models/userModel'
import AllowedLocations from '../models/allowedLocations'
require("dotenv").config();
const _=require('lodash')
import sendEmail from '../services/sendEmail'

exports.createUser = async(req,res,next)=>{
 const unHashedPassword = req.body.fullname.substring(0,5)+Math.floor(Math.random()*1000);
    const user = new User({
                fullname: req.body.fullname,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                gender:req.body.gender,
                location:req.body.location,
                password: unHashedPassword,
                role:req.body.role,
    }) 

    try { 
       const data = await user.save()
       const userInfo = user;
       userInfo.password = unHashedPassword;  
       await sendEmail(userInfo,'signup').catch((error)=>console.log('error',error))
       return res.status(200).send({user: data})
       
    } catch (error) {
       return res.status(400).send(error.message)
    }
}

exports.getUser= async (req,res)=>{
    try {
        const user = await User.find()
        return res.status(200).send(user)
    } catch (error) {
        return res.status(404).send(error.message)
    }
    }
    
exports.deleteUser =async (req,res)=>{
    try{
    await User.deleteOne({_id:req.params.id})
    return res.status(200).json("delete successfully")
    }catch(error){
    return res.status(404).send(error.message)
    }
}

exports.createLocation = async (req,res)=>{
    const locationData = new AllowedLocations({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        radius: req.body.radius
    })
   try {
    if(locationData){
        const location = await locationData.save()
        return res.status(200).send({
            message: 'location created successful',
            location
        })
    }else{
        return res.status(400).send({
            message: 'please fill the form first'
        })
    }
   } catch (error) {
       return res.status(500).send(error.message);
   }
}

exports.getLocations= async (req,res)=>{
    try {
        const locations = await AllowedLocations.find()
        return res.status(200).send(locations)
    } catch (error) {
        return res.status(404).send(error.message)
    }
    }

exports.deleteLocation = async (req,res)=>{
    try{
        await AllowedLocations.deleteOne({_id:req.params.id})
        return res.status(200).json("delete successfully")
    } catch (error) {
        return res.status(500).send(error.message);
    }
}






