let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const MessageModel = new Schema({
    content: {
        type: String,
        required: [true, "insert a content"]
    },
    flatID: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "Flats", 
        required: true,
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User", 
        required: true,
    },
    receiverID: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User", 
        required: true,
    },
    created: Date
}, { versionKey: false });


module.exports = mongoose.model("Messages", MessageModel);