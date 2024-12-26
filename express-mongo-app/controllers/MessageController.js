let MessageModel = require("../models/MessageModel");
let FlatModel = require("../models/FlatModel")
let UserModel = require("../models/UserModel");


exports.addMessage = async function(req, res, next) {
    try {
        let messageDetails = req.body; // Detaliile mesajului din cerere
        messageDetails.created = new Date();
        messageDetails.flatID = req.params.id; // ID-ul flat-ului din parametru
        messageDetails.senderID = req.user.id; // ID-ul utilizatorului logat (expeditor)

        if (!messageDetails.receiverID) {
            return res.status(400).json({ error: "Receiver ID is required." });
        }

        // Crează un nou mesaj
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

exports.getMessagesByUser = async (req, res) => {
    try {
        const loggedUserId = req.user.id; // ID-ul utilizatorului logat
        console.log(loggedUserId);
        // Găsește mesajele unde utilizatorul logat este destinatar
        const messages = await MessageModel.find({
            receiverID: loggedUserId,
        })
        .populate('senderID', 'fullName email') // Populează expeditorul (nume și email)
        .populate('flatID', 'name address'); // Populează informațiile despre flat (nume și adresă)

        if (!messages.length) {
            return res.status(404).json({ message: "No messages received by this user." });
        }

        // Trimite mesajele către client
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
        const { receiverID, content, flatID } = req.body; // Adaugă flatID aici
        const currentUserID = req.user.id; // ID-ul utilizatorului autentificat (expeditorul răspunsului)

        if (!receiverID || !content || !flatID) { // Verifică dacă flatID este inclus
            return res.status(400).json({ error: "Receiver ID, content, and flatID are required." });
        }

        // Crează un nou mesaj de răspuns
        const replyMessage = new MessageModel({
            content: content, // Conținutul mesajului
            senderID: currentUserID, // Expeditorul este utilizatorul care răspunde
            receiverID: receiverID, // Destinatarul este persoana care a trimis mesajul inițial
            flatID: flatID, // Adaugă flatID în mesaj
            created: new Date(),
            replyTo: receiverID, // Poți adăuga un câmp 'replyTo' pentru a lega acest mesaj de mesajul inițial
        });

        console.log(replyMessage);

        // Salvează mesajul de răspuns în baza de date
        const savedReply = await replyMessage.save();

        console.log("Reply sent successfully.");
        res.status(200).json({ message: "Reply sent successfully.", data: savedReply });
    } catch (error) {
        console.error("Error sending reply:", error);
        res.status(500).json({ error: error.message });
    }
};








