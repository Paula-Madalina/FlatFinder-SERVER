const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

router.get("/",authMiddleware.verifyAdmin,UserController.getAllUsers);
router.get("/:userId",UserController.getUserById);



module.exports = router;