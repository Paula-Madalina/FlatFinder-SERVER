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

const updateUser = async(req,res,next) => {
    try {
        let userID = req.params.id;
        let updatedUser = req.body;
        let user = await UserModel.findById(userID);
        if(!user) {
            return res.status(404).json({message:"User Not Found"});
        }
        if(user._id.toString() !== req.user.id) {
            return res.status(403).json({error:"you have no permission to update this user"})
        }

        const updatedUserData = await UserModel.findByIdAndUpdate(userID, updatedUser, {new:true});
        console.log(updatedUserData);
        res.status(200).json({message:"Updated Successully"})
    }catch(error) {
        console.log(error);
        res.status(500).json({error:error.message})
    }
}

const deleteUser = async(req,res,next) => {
    try {
        const userID = req.params.id;
        const user = await UserModel.findById(userID);
        
        if(!user) {
           return  res.status(404).json({message:"USER NOT FOUND"});
        }

        if(user._id.toString() !== req.user.id) {
            return res.status(403).json({error:"you dont have permission to delete this user"})
        }

        const deletedUser = await UserModel.findByIdAndDelete(userID);

       return  res.status(200).json({message:"User deleted successfully", data: deletedUser})

    } catch(error) {
        console.log(error);
        res.status(500).json({error:error.message})
    }
}



module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}