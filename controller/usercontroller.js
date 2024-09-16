const User=require('../model/userModel')
const bcrypt = require('bcrypt')
// import { nanoid } from 'nanoid'
require('dotenv').config()
const jwt = require('jsonwebtoken')

const formateData=(user)=>{
    const access_token=jwt.sign({id:user._id},process.env.JWT_SECRET)
    return {
     access_token,
     username:user.username,
     profile_img:user.profile_img
    }
}

exports.SignUp=async(req,res)=>{
    try{
        // console.log("first")
        let {username,password}=req.body
        if( !password || !username){
            return res.status(400).json({
                success:false,
                message:"Please Enter All field"
            })
    
        }
        let alreadyexisting = await User.findOne({ username });
        if(alreadyexisting){
            return res.status(400).json({
                success:false,
                message:"This username is already resistered with us please login or use another username"
            })
     
        }

        let hashpassword = await bcrypt.hash(password,10)

        const user= await new User({
            username:username,
            password:hashpassword
        }).save();

        let sendData=formateData(user);
        
        return res.status(200).json({
            success:true,
            message:"User signup success",
            sendData

        })

    }
    catch(e){
        // console.log(e)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while creating registration",

        })
    }
}

exports.login=async(req,res)=>{
    try{
        const{username,password}= req.body;
        // console.log(password)
        if(!username || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        let user= await User.findOne({username:username})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"This user is not registered"
            })

        }
        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(400).json({
                success:false,
                message:"Password Incorrect"
            })

        }

        let sendData=formateData(user)

        return res.status(200).json({
            success:true,
            message:"User login success",
           sendData
        })


    }
    catch(e){
        // console.log(e)
        return res.status(400).json({
            success:false,
            message:"Error while login"
        })

    }
}