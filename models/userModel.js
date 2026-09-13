const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");
const JWT=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,'PAssword length should be 6 character long']
    },
    customerId:{
        type:String,
        default:""
    },
    subscription:{
        type:String,
        default:""
    }
});

//hashed password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//match password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//SIGN token
userSchema.methods.getSignedToken = function (res) {
    const accessToken = JWT.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });
    const refreshToken = JWT.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY,
    });
    res.cookie('refreshToken', `${refreshToken}`, {
        maxAge: 86400 * 7000,
        httpOnly: true,
    });
};
const User=mongoose.model('User',userSchema);
module.exports=User;