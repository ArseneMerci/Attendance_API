import jwt from "jsonwebtoken";
import User from "../models/userModel";
require("dotenv").config();

const adminAuth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user || decoded.role!=='admin'){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error:'AUTHENTICATION_ERROR'})
    }
}

const userAuth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user || decoded.role!=='user'){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error:'AUTHENTICATION_ERROR'})
    }
}
    
module.exports={
    adminAuth,
    userAuth
}