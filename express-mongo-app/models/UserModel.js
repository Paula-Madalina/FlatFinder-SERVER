let mongoose = require("mongoose");
// let bcrypt = require("bcrypt");
let { hashPassword } = require("../services/encryption-service")

let UserSchema = new mongoose.Schema({
    email: {
        type:String,
        required:[true,"Must provide an email"],
        unique:true
    },
    password: {
        type:String,
        required:[true,"Must provide a password"],
        minlength:[2, "Password must have more than 2 chars"]
    },
    firstName: {
        type:String,
        required:[true,"Must provide a first name"]
    },
    lastName: {
        type:String,
        required:[true,"Must provide a last name"]
    },
    birthDate: { 
        type:Date,
        required:[true,"Must provide a birth date "]
    },
    isAdmin: {
        type:Boolean,
        default: false
    },
    favoriteFlatList: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Flats"
    },
    created:{
        type:Date,
        default: Date.now
    },
    updated:{
        type:Date,
        default: Date.now
    }
},
{
    versionKey:false
}
)

UserSchema.pre("save", async function(next) {
    console.log("pre save hook")
    const user = this;
    if(!user.isModified("password")) {
        return next()
    }
    try{
        const hashedPassword = await hashPassword(user.password);
        console.log("mashed password");
        console.log(hashedPassword)
        user.password = hashedPassword;
        next();
    }catch(error) {
        next(error)
    }
   
})

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel;