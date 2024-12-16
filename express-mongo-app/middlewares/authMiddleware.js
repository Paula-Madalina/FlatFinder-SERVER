const {} = require("../services/encryption-service");
let jwt = require("jsonwebtoken")

const verifyAuthentication = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw Error("No token provided");
        // console.log("Extracted token:", token); 


        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded token:", decoded); 

        const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix format (seconds)
        if (decoded.exp < currentTime) {
            return res.status(401).json({message: "Token has expired"});
        }

        req.user = decoded;

        next(); 
    } catch (error) {
        res.status(401).json({message: error.message});
    }
};

const verifyAdmin = (req,res,next) => {
    const userRole = req.user.isAdmin;
    if(!userRole) {
        return res.status(401).json({message:"you are not the adminn"})
    }
    console.log("user is admin");
    next()
}


module.exports = {
    verifyAuthentication,
    verifyAdmin
}