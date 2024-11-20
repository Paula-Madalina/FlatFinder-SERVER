const UserModel = require("../models/UserModel");
const responseUtils= require("../services/responseUtils")


const getAllUsers = async(req,res) => {
    try {
        const users = await UserModel.find().select('-password');
        res.status(200).json(users);

    }catch(error) {
        res.status(400).json({message:error.message})
    }
}

const getUserById = async(req,res,next) => {
    try {
        const userId = req.params.userId;
        const userData = await UserModel.findById(userId).select('-password');
        console.log(userData)

        if(!userData) {
            const error = new Error("USER NOT FOUND");
            error.statusCode = 404;
            throw error

        } 
        res.status(200).json(userData);

    }catch(error) {
        console.log(error)
        res.status(error.statusCode || 500).json({message:error.message})
    }
}


module.exports = {
    getAllUsers,
    getUserById
}