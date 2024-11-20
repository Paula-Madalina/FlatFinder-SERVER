const UserModel = require("../models/UserModel");
const {comparePasswords,signToken} = require("../services/encryption-service");
const responseUtils= require("../services/responseUtils")


const registerUser = async function (req,res,next) {
    const userData = req.body;
    try{
        const newUser = new UserModel(userData);
        const response = await newUser.save();
        console.log("RESPONSE ON REGISTER USER")
        console.log(response);

        res.status(201).json({message:"User registered Successfully", data:newUser._id})
    }catch(error) {
        next(error)
    }
}

const loginUser = async(req,res,next) => {
    const { email, password } = req.body;
    console.log(email,password);
    try {
        if(!email || !password) throw new responseUtils.BadRequest400Error("email and password are required");

        const userEntry = await UserModel.findOne({email:email});

        if(!userEntry) throw Error("user doesn't exist");

        const hashedPassword = userEntry.password;
        const passwordValid = await comparePasswords(password,hashedPassword)

        if(!passwordValid) throw Error ("Passwords don't match")
        console.log(userEntry);
        const token = signToken(userEntry);
        res.status(200).json(token);
    }catch(error) {{
        next(error)
    }}
}

module.exports = {
    registerUser,
    loginUser
}