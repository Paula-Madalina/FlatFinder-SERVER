const mongoose = require("mongoose");
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority&appName=FlatFinder-Cluster`



const connectDB = async () => {


    try {
        console.log("MONGO_URI:", MONGO_URI)
        await mongoose.connect(MONGO_URI);
        console.log("success");


    } catch(error){
        console.warn("fail");
        console.error(error.message);
    }
}

module.exports = connectDB;