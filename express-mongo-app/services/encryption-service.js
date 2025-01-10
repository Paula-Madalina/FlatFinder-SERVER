const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const jwt = require("jsonwebtoken")

//password encryption
const hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword;
    } catch(error) {
        console.error("error while hashing password");
        console.error(error.message);
        return error;
    }

}

//compare passwords
const comparePasswords = async(inputPassword,hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(inputPassword,hashedPassword);
        return isMatch;
    }catch(error) {
        console.error("error while comparing password");
        console.error(error.message);
        return error;    
    }
}

//token generation
const signToken = (user) => {
    const payload = {
        id:user._id,
        email:user.email,
        fullName: user.fullName, 
        isAdmin:user.isAdmin
    }
    const secretKey = process.env.SECRET_KEY;
    const jwtOptions = {
        expiresIn: "1h"

    };
    const token = jwt.sign(payload,secretKey,jwtOptions);

    return token;
}

module.exports = {
    hashPassword,
    comparePasswords,
    signToken
};