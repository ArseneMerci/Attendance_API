import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import User from '../models/userModel'
import Attendence from '../models/attendenceModel'
require("dotenv").config();
import checkLocation from '../services/checkLocation'
import {calculateHours} from '../services/calculateHours'
import sendEmail from '../services/sendEmail';

exports.verifyUserLocation=async(req,res)=>{
    const {latitude,longitude}=req.body
    const isAllowed = await checkLocation(latitude,longitude)
  if(isAllowed){
        res.status(200).json({
            message:"location is allowed"
        })
    }else{
        res.status(400).json({
            message:"location is not allowed"
        })
    }
}

exports.loginUser = async(req,res,next)=>{
    try {
        const user = await User.findOne({ email:req.body.email });
        if (!user) {
          return res.status(404).json({messsage:'User Not Found', error:"NOT_FOUND"});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(400).json({messsage:'password is incorrect', error:"AUTHENTICATION_ERROR"});
        }
    // const user = await User.findByCredentials(req.body.email, req.body.password, res)
    
    const {latitude,longitude}=req.body

    const attendance =new Attendence({
        owner:user._id 
    })
     if(user.role === 'admin'){
        await attendance.save()
        await user.generateAuthToken(attendance._id)
        return res.status(200).send({message:"Login successfully",user})
     }else{
        const isAllowed = await checkLocation(latitude,longitude)
        if(isAllowed){
            await attendance.save()
            await user.generateAuthToken(attendance._id)
            return res.status(200).send({message:"Login successfully",user})
        }else{
            res.status(400).json({
                message:"location is not allowed"
            })
        }
     }
    }catch(error) {
        return res.status(404).send(error.message)
    }
 }
 

exports.logout = async(req,res)=>{
    try {
        const {token}=req;
        const { attendence_id } = jwt.verify(token, process.env.SECRET_KEY)
        const userId=req.user._id.toString()
        const users = await User.findOne({_id:userId}).catch((error) => {
            return res.status(400).json({
                error: error,
                
            });
        })
        if(users.token !== token){
          return  res.status(404).send({
            message: 'Token not found',
        })
        }
        const loggOut=new Date()
        const attendence = await Attendence.findOne({_id:attendence_id})
        const workedTime = calculateHours(attendence, loggOut)

        await Attendence.findByIdAndUpdate(attendence_id,{loggedOut:loggOut, hoursWorked:workedTime})
        .then(() => {
            res.status(200).send({
                message: 'logged out successfully',
            })})
            await User.findByIdAndUpdate(req.user._id,{token:null})
    } catch (error) {
        return res.status(500).send()
    }
}

exports.forgetPassword= async (req,res)=>{
    try {
        const {email}=req.body;
        await User.findOne({email},async (err,user)=>{
            if(err || !user){
                return res.status(400).json({error:"user of this email does not exists"})
            }
            const userInfo = {
                token:jwt.sign({_id: user._id},process.env.RESET_PASSWORD_ID),
                email:user.email
            }
            await sendEmail(userInfo,'forgotPassword').then(()=>{
                console.log('Email sent successfully')
            }).catch((err)=>{
                console.log(err)
            })
            return res.status(200).send({message:'Token Sent Successfully'})
        }).clone()
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

exports.resetPassword=async (req,res)=>{
    try{
        const{token,newPassword}=req.body;
        if(token){
            const data = await jwt.verify(token,process.env.RESET_PASSWORD_ID)
            const userInfo = await User.findOne({_id:data._id.toString()})
            if(!userInfo) return res.status('404').send({message:"User not found"})
            const newHashedPassword = await bcrypt.hash(newPassword, 8);
            await User.findByIdAndUpdate(userInfo._id,{password:newHashedPassword}).catch((err)=>{return res.status(403).send({message:'failed to update'})})
            return res.status('201').send({message:'Password changed successfully'})
        }else{
            return res.status('404').send({message:"User not found"})
        }
    }catch(error){
        return res.status(500).send(error.message)
    }
}




