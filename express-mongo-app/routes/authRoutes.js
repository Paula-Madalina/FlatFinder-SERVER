const express = require("express");
const AuthController = require("../controllers/AuthController")
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const UserModel = require("../models/UserModel");

router.post("/register", AuthController.registerUser);
router.post('/login', AuthController.loginUser)

router.get("/verify", authMiddleware.verifyAuthentication, async (req, res) => {
  console.log(req.user)
  try {
    const user = await UserModel.findById(req.user.id).select("-password"); // Exclude parola
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User is authenticated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;