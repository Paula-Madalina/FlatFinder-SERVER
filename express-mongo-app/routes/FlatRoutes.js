const FlatController = require("../controllers/FlatController");
const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.post("/register", authenticateToken.verifyAuthentication, FlatController.flatRegister);
router.get("/getByID/:id", FlatController.getFlatByID);
router.get("/getAllFlats", FlatController.getAllFlats);
router.patch("/updateFlat/:id",authenticateToken.verifyAuthentication , FlatController.updateFlat);
router.delete("/deleteFlat/:id", authenticateToken.verifyAuthentication ,FlatController.deleteFlat);

module.exports = router;
