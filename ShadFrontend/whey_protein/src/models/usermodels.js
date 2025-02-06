import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide a username"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Enter a password"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokeneExpiry:Date
})

const Users=mongoose.models.users  || mongoose.models("users",userSchema)
export default user