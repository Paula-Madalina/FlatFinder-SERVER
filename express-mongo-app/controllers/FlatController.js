let FlatModel = require("../models/FlatModel");
let UserModel  = require("../models/UserModel");
const responseUtils = require("../services/responseUtils")

exports.flatRegister = async function (req, res, next) {
    try {
        let flatDetails = req.body;
        flatDetails.created = new Date();
        flatDetails.updated = new Date();
        flatDetails.ownerID = req.user.id;

        
        let newFlat = new FlatModel(flatDetails);
        const savedFlat = await newFlat.save();

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user.id,
            { $push: { favoriteFlatList: savedFlat._id } },
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


exports.getFlatByID = async function(req,res,next) {
    try {
        const flatID = req.params.id;
        const flatData = await FlatModel.findById(flatID);
        console.log(flatData);
    
        if(!flatData) {
            const error = new Error("FLAT NOT FOUND");
            error.statusCode = 404;
            throw Error;
        }
        res.status(200).json(flatData)
    }catch(error) {
        console.log(error);
        res.status(error.statusCode || 500).json({message: error.message})
    }
}

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

        // Actualizează și returnează datele noi
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
