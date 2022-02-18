
import User from '../database/models/userModel'
import AllowedLocations from '../database/models/allowedLocations'
import dotenv from 'dotenv'
dotenv.config()
import sendEmail from '../helpers/sendEmail'
import UserService from '../database/services/User'
import { generate } from '../helpers/bcrypt';

exports.createUser = async(req,res,next)=>{
    try { 
        const { fullname, email } = req.body
        const unHashedPassword = fullname.substring(0,5)+Math.floor(Math.random()*1000);
        const exist = await UserService.findUser({email})
        if(exist) return res.status(409).json({ error: 'Account already exist!', message:'CONFLICT_ERROR' })
        req.body.password = await generate(unHashedPassword)
        const newAccount = await UserService.signUp(req.body)
        newAccount.password = undefined;
        await sendEmail({unHashedPassword, email},'signup').catch((error)=>console.log('error',error))
        return res.status(201).json({message:'Signed up successfully', data: newAccount})
       
    } catch (error) {
        return res.status(500).json({ error: error.message || error, message:'SERVER_ERROR' })
    }
}

exports.getUser= async (req,res)=>{
    try {
        const user = await UserService.findAllUsers()
        return res.status(200).json({message:'All Accounts Fetched successfully', data: user})
    } catch (error) {
        return res.status(500).json({ error: error.message || error, message:'SERVER_ERROR' })
    }
    }
    
exports.deleteUser =async (req,res)=>{
    try{
        const { id } = req.params;
        const exist = await UserService.findUser({_id:id})
        if(!exist) return res.status(404).json({ error: "Account doesn't exist!", message:'NOT_FOUND' })
        await UserService.deleteUser({_id:req.params.id})
        return res.status(200).json({message:'Account Deleted successfully'})
    }catch(error){
        return res.status(500).json({ error: error.message || error, message:'SERVER_ERROR' })
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
        return res.status(200).json({
            message: 'location created successful',
            location
        })
    }else{
        return res.status(400).json({
            message: 'please fill the form first'
        })
    }
   } catch (error) {
       return res.status(500).json(error.message);
   }
}

exports.getLocations= async (req,res)=>{
    try {
        const locations = await AllowedLocations.find()
        return res.status(200).json(locations)
    } catch (error) {
        return res.status(404).json(error.message)
    }
    }

exports.deleteLocation = async (req,res)=>{
    try{
        await AllowedLocations.deleteOne({_id:req.params.id})
        return res.status(200).json("delete successfully")
    } catch (error) {
        return res.status(500).json(error.message);
    }
}






