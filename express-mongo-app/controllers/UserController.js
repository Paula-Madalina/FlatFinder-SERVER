const UserModel = require("../models/UserModel");
const responseUtils= require("../services/responseUtils")
const encryption = require("../services/encryption-service");
const FlatModel = require("../models/FlatModel");


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
  
      // Dacă parola a fost inclusă în cererea de actualizare, o criptăm
      if (updatedUser.password) {
        updatedUser.password = await encryption.hashPassword(updatedUser.password);
      }
  
      // Actualizează utilizatorul manual și salvează-l
      user.set(updatedUser); // Setează noile valori
      const updatedUserData = await user.save(); // Salvează documentul cu noile date (inclusiv parola criptată dacă a fost modificată)
  
      console.log(updatedUserData);
  
      // Trimite utilizatorul actualizat în răspuns
      res.status(200).json({
        message: "Updated Successfully",
        user: updatedUserData, // Trimite datele utilizatorului actualizate
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
        console.log("mergeeeE??" + userToDelete);

        
        if(!userToDelete) {
           return  res.status(404).json({message:"USER NOT FOUND"});
        }

        if(!loggedInUser.isAdmin) {
          if (userToDelete.id !== userID) {
            return res.status(403).json({ message: "Nu aveți permisiunea să ștergeți acest cont!" });
          }
        }

        if (loggedInUser.isAdmin) {
          if (userToDelete.isAdmin && userToDelete.id !== userID) {
              return res.status(403).json({ message: "Nu aveți permisiunea să ștergeți alți administratori!" });
          }
      }
      const deletedFlats = await FlatModel.deleteMany({ownerID : id});
      console.log(`Deleted ${deletedFlats.deletedCount} flats owned by the user.`)

      // Șterge utilizatorul
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



module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    makeAdmin,
}