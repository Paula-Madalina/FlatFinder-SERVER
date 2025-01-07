const express = require("express");
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

router.get("/",authMiddleware.verifyAuthentication,authMiddleware.verifyAdmin,UserController.getAllUsers);
router.get("/:userId",authMiddleware.verifyAuthentication,UserController.getUserById);
router.patch("/updateUser/:id",authMiddleware.verifyAuthentication ,UserController.updateUser);
router.delete("/deleteUser/:id",authMiddleware.verifyAuthentication ,UserController.deleteUser);
router.patch("/makeAdmin/:id",authMiddleware.verifyAuthentication, UserController.makeAdmin)
router.post("/forgotPassword", UserController.forgotPassword);
router.post("/resetPassword/:token", UserController.resetPassword)





module.exports = router;