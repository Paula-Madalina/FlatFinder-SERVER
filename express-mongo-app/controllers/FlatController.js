let FlatModel = require("../models/FlatModel");
let UserModel  = require("../models/UserModel");
const responseUtils = require("../services/responseUtils")

exports.flatRegister = async function (req, res, next) {
    try {
        let flatDetails = req.body;
        flatDetails.created = new Date();
        flatDetails.updated = new Date();
        flatDetails.ownerID = req.user.id;

        console.log(flatDetails)
        let newFlat = new FlatModel(flatDetails);
        const savedFlat = await newFlat.save();

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user.id,
            { $push: { flatList: savedFlat._id } },
            { new: true } 
        );

        console.log("Flat registered successfully");
        res.status(200).json({
            message: "Success",
            data: `The flat with id ${savedFlat._id} registered successfully`,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMyFlats = async function (req, res, next) {
    try {
        const userIDFromToken = req.user.id; 
        console.log("userID from token:", userIDFromToken);   

        const myFlats = await FlatModel.find({ ownerID: userIDFromToken.toString() });
        console.log(myFlats)

        if (myFlats.length === 0) {
            return res.status(404).json({ message: "No flats found for this user" });
        }

        res.status(200).json({ message: "Flats retrieved successfully", data: myFlats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




exports.getFlatByID = async function(req, res, next) {
    try {
      const flatID = req.params.flatId; 
      console.log("Flat ID received in backend:", flatID); 
  
      const flatData = await FlatModel.findById(flatID);
      if (!flatData) {
        return res.status(404).json({ message: "FLAT NOT FOUND" });
      }
  
      res.status(200).json(flatData);
    } catch (error) {
      console.error("Error in getFlatByID:", error.message); 
      res.status(500).json({ message: error.message });
    }
  };
  
  
  

exports.getAllFlats = async function(req,res,next) {
    try {
        const flats = await FlatModel.find();
        console.log(flats);
        res.status(200).json({data:flats})
    }catch(error) {
        console.log(error.message);
        res.status(500).json({error:error.message})
    }
}


exports.updateFlat = async function (req, res, next) {
    try {
        const flatID = req.params.id;
        const updatedFlat = req.body;

        const flat = await FlatModel.findById(flatID);

        if (!flat) {
            return res.status(404).json({ message: "Flat NOT FOUND" });
        }

        if(flat.ownerID.toString() !== req.user.id) {
            return res.status(403).json({error:"you don t have permission to update this flat"})
        }

        const updatedData = await FlatModel.findByIdAndUpdate(flatID, updatedFlat, { new: true });


        console.log(updatedData);
        res.status(200).json({message:"Flat updated successfully", data: updatedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteFlat = async function (req, res, next) {
    try {
        const flatID = req.params.id;

        const flat = await FlatModel.findById(flatID);

        if (!flat) {
            return res.status(404).json({ message: "Flat NOT FOUND" });
        }

        if (flat.ownerID.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to delete this flat" });
        }

        const deletedFlat = await FlatModel.findByIdAndDelete(flatID);

        res.status(200).json({
            message: "Flat deleted successfully",
            data: deletedFlat,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.toggleFavoriteFlat = async (req, res) => {
    try {
      const userId = req.user.id;
      const flatId = req.params.flatId;
  
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isFavorite = user.favoriteFlatList.includes(flatId);
  
      if (isFavorite) {
        user.favoriteFlatList = user.favoriteFlatList.filter(
          (id) => id.toString() !== flatId
        );
      } else {
        user.favoriteFlatList.push(flatId);
      }
  
      await user.save();
  
      res.status(200).json({
        message: "Favorite list updated successfully",
        data: user.favoriteFlatList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

exports.getFavoriteFlats = async (req, res) => {
    try {
        const userId = req.params.userId;  
        const user = await UserModel.findById(userId).populate('favoriteFlatList'); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const favoriteFlats = user.favoriteFlatList;  
      res.status(200).json({ data: favoriteFlats });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch favorite flats' });
    }
  };

  const mongoose = require('mongoose');

  exports.removeFromFavorites = async (req, res) => {
    try {
      const userId = req.user.id; 
      console.log(`Current user ID: ${userId}`);
  
      const flatId = req.params.flatId;  
      console.log(`Flat ID to remove: ${flatId}`);
  
      const user = await UserModel.findById(userId);
      if (!user) {
        console.log("User not found in the database");
        return res.status(404).json({ message: 'User not found' });
      }
  
      console.log("Favorites before update:", user.favoriteFlatList);
  
      user.favoriteFlatList = user.favoriteFlatList.filter((id) => id.toString() !== flatId);  
      await user.save();
  
      console.log("Favorites after update:", user.favoriteFlatList);
  
      res.status(200).json({ message: 'Flat removed from favorites', data: user.favoriteFlatList });
    } catch (error) {
      console.log("Error in removeFromFavorites:", error);
      res.status(500).json({ message: 'Failed to remove flat from favorites' });
    }
  }
  
  
  
  

exports.flatByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("merge?? " + userId);
      
      const user = await UserModel.findById(userId, "flatList");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const flats = await FlatModel.find({
        '_id': { $in: user.flatList }
      });
      
      console.log("Apartments found for user: ", flats);
      
  
      res.status(200).json(flats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorite flats list", error });
    }
  };

  exports.flatsCount = async(req,res,next) => {
    try {
        const userId = req.params.userId;
        console.log('userId:', userId); 

        const flatsCount = await FlatModel.countDocuments({ ownerID: userId });

        res.json({ count: flatsCount });
    } catch (error) {
        console.error('Error counting flats:', error);
        res.status(500).send('Server error');
    }
};
  