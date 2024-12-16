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

exports.getMyFlats = async function (req, res, next) {
    try {
        const userIDFromToken = req.user.id; // ID-ul utilizatorului din token
        console.log("userID from token:", userIDFromToken);   // Verifică în backend dacă token-ul este valid

        // Caută apartamentele utilizatorului (unde ownerID este userID din token)
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
      const flatID = req.params.flatId; // Este parametrul ID definit corect?
      console.log("Flat ID received in backend:", flatID); // Adaugă acest log
  
      const flatData = await FlatModel.findById(flatID);
      if (!flatData) {
        return res.status(404).json({ message: "FLAT NOT FOUND" });
      }
  
      res.status(200).json(flatData);
    } catch (error) {
      console.error("Error in getFlatByID:", error.message); // Log detaliat
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


exports.getFavoriteFlats = async (req, res) => {
    try {
        const userId = req.user.id; // ID-ul utilizatorului autenticat, obținut prin middleware-ul de autentificare
        const user = await UserModel.findById(userId).populate('favoriteFlatList'); // Se folosește populate pentru a aduce apartamentele favorite

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'Favorite flats fetched successfully',
            data: user.favoriteFlatList, // Aceasta va returna lista de apartamente favorite
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};