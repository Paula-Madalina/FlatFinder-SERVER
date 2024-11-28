const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FlatModel = new Schema({
    city: {
        type:String,
        required:[true, "Enter a city name"]
    },
    streetName: {
        type:String,
        required:[true, "Enter a street name"]
    },
    streetNumber: {
        type:Number,
        required:[true, "Enter a street number"]
    },
    areaSize: {
        type:Number,
        required:[true, "Include an area size"]
    },
    hasAC: {
        type:Boolean,
        required:true
    },
    yearBuilt: {
        type:Number,
        required:true,
    },
    rentPrice: {
        type:String,
        required:[true, "Include a rent price"]
    },
    dateAvailable: {
        type:Date,
        required:true
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User", 
        required: true,
    },
    created: Date,
    updated:Date


},{versionKey:false})

module.exports = mongoose.model("Flats", FlatModel)