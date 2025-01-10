const UserModel = require("../models/UserModel");
const responseUtils= require("../services/responseUtils")
const encryption = require("../services/encryption-service");
const FlatModel = require("../models/FlatModel");
const MessageModel = require("../models/MessageModel");
let utils = require("../services/utils")
const authMiddleware = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken")



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

const updateUser = async (req, res, next) => {
    try {
      let userID = req.params.id;
      let updatedUser = req.body;
      let user = await UserModel.findById(userID);
  
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
  
      if (user._id.toString() !== req.user.id) {
        return res.status(403).json({ error: "You have no permission to update this user" });
      }
  
      if (updatedUser.password) {
        updatedUser.password = await encryption.hashPassword(updatedUser.password);
      }
  
      user.set(updatedUser); 
      const updatedUserData = await user.save(); 
  
      console.log(updatedUserData);
  
      res.status(200).json({
        message: "Updated Successfully",
        user: updatedUserData, 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  
const deleteUser = async(req,res,next) => {
        const userID = req.user.id;
        const { id } = req.params; 

        try {
          const userToDelete = await UserModel.findById(id)
        const loggedInUser = await UserModel.findById(userID);
        
        if(!userToDelete) {
           return  res.status(404).json({message:"USER NOT FOUND"});
        }

        if (!loggedInUser.isAdmin) {
          if (userToDelete.id !== userID) {
              return res.status(403).json({ message: "You do not have permission to delete this account!" });
          }
      }

      if (loggedInUser.isAdmin) {
        if (userToDelete.isAdmin && userToDelete.id !== userID) {
            return res.status(403).json({ message: "You do not have permission to delete other admins!" });
        }
    }

      await MessageModel.deleteMany({
        $or: [
          {senderID: id},
          {receiverID:id}
        ]
      })

      const deletedFlats = await FlatModel.deleteMany({ownerID : id});
      console.log(`Deleted ${deletedFlats.deletedCount} flats owned by the user.`)

      await UserModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Account deleted successfully!" });


    } catch(error) {
        console.log(error);
        res.status(500).json({error:error.message})
    }
}

const makeAdmin = async (req,res,next) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { isAdmin : true },
      { new: true }
    )

    if(!user) {
      return res.status(404).json({message:"USER NOT FOUND"});
    }

    res.status(200).json({message: "User updated to admin", user});
  } catch(error) {
    console.log(error);
    res.status(500).json({message: "Failed to update User", error:error.message})
  }
}


const forgotPassword = async function(req,res,next) {
 
      let user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
          res.json({ error: "please specify email!" });
          return;
      }
      let resetToken = encryption.signToken(user._id);
      user.passwordChangeToken = resetToken;
      await user.save();
      let url = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
      let message = "click on the link to reset password";

      await utils.sendEmail({
          from: "myapplication@noreply.com",
          email: user.email,
          subject: "Reset password",
          text: `${message} \r\n ${url}`
      });
      res.json({ message: "A link to reset your password has been sent.", token: resetToken });
    
}

const resetPassword = async function(req,res,next) {
  console.log("asdfgh",req.params.token); 
  let token = req.params.token;
  console.log("token" , token); 
  
      let user = await UserModel.findOne({passwordChangeToken:token});
      if(!user) {
          res.json({error:"User doesn t exist or has not requested password change"});
          return;
      }
      user.password = req.body.password;
      user.passwordChangeToken = undefined;
      await user.save();
      const newToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.json({status:newToken})
  // }
}


module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  makeAdmin,
  forgotPassword,
  resetPassword
}