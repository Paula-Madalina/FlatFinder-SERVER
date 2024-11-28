let MessageModel = require("../models/MessageModel");
let FlatModel = require("../models/FlatModel")
let UserModel = require("../models/UserModel")

exports.addMessage = async function(req,res,next) {
   try {
        let messageDetails = req.body;
        messageDetails.created = new Date();
        messageDetails.flatID = req.params.id;
        messageDetails.senderID = req.user.id;

        let newMessage = new MessageModel(messageDetails);
        let savedMessage = await newMessage.save();

        console.log("message registered");
        res.status(200).json({message:"Success", data:`The message with id ${savedMessage._id} registered successfully`})


   } catch(error) {
        console.log(error);
        res.status(500).json({error:error.message})
   }

}

exports.getUserMessages = async function(req, res, next) {
    try {
        let flatID = req.params.id;
        // Extrage ID-ul utilizatorului autentic din token
        let senderID = req.user.id;

        if (!senderID) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        // Căutăm mesajele trimise de utilizatorul autentic pentru apartamentul specificat
        const allMessages = await MessageModel.find({
            flatID: flatID,
            senderID: senderID
        });

        if (!allMessages.length) {
            return res.status(404).json({ message: "No messages found" });
        }

        res.status(200).json({ allMessages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


exports.getAllMessages = async function(req, res, next) {
    try {
        let flatID = req.params.id;
        let messages = await MessageModel.find({ flatID });

        if (messages.length === 0) {
            return res.status(404).json({ message: "No messages for this flat" });
        }

        res.status(200).json({ messages: messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};