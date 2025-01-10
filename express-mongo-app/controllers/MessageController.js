let MessageModel = require("../models/MessageModel");
let FlatModel = require("../models/FlatModel")
let UserModel = require("../models/UserModel");


exports.addMessage = async function(req, res, next) {
    try {
        let messageDetails = req.body; 
        messageDetails.created = new Date();
        messageDetails.flatID = req.params.id; 
        messageDetails.senderID = req.user.id; 

        if (!messageDetails.receiverID) {
            return res.status(400).json({ error: "Receiver ID is required." });
        }

        let newMessage = new MessageModel(messageDetails);
        let savedMessage = await newMessage.save();

        console.log("Message registered successfully.");
        res.status(200).json({ message: "Success", data: savedMessage });
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getUserMessages = async function(req, res, next) {
    try {
        let flatID = req.params.id;
        let senderID = req.user.id;

        if (!senderID) {
            return res.status(403).json({ message: "User not authenticated" });
        }

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

exports.getMessagesByUser = async (req, res) => {
    try {
        const loggedUserId = req.user.id; 
        console.log(loggedUserId);
        const messages = await MessageModel.find({
            receiverID: loggedUserId,
        })
        .populate('senderID', 'fullName email') 
        .populate('flatID', 'name address');

        if (!messages.length) {
            return res.status(404).json({ message: "No messages received by this user." });
        }

        res.status(200).json({
            message: "Messages retrieved successfully.",
            data: messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Something went wrong while fetching messages." });
    }
};


exports.sendReply = async function(req, res, next) {
    try {
        const { receiverID, content, flatID } = req.body; 
        const currentUserID = req.user.id; 

        if (!receiverID || !content || !flatID) { 
            return res.status(400).json({ error: "Receiver ID, content, and flatID are required." });
        }

        const replyMessage = new MessageModel({
            content: content,
            senderID: currentUserID, 
            receiverID: receiverID, 
            flatID: flatID, 
            created: new Date(),
            replyTo: receiverID,
        });

        console.log(replyMessage);

        const savedReply = await replyMessage.save();

        console.log("Reply sent successfully.");
        res.status(200).json({ message: "Reply sent successfully.", data: savedReply });
    } catch (error) {
        console.error("Error sending reply:", error);
        res.status(500).json({ error: error.message });
    }
};








