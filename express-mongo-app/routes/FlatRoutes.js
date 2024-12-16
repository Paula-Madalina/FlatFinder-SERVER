const FlatController = require("../controllers/FlatController");
const express = require("express");
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.post("/register", authenticateToken.verifyAuthentication, FlatController.flatRegister);
router.get("/getByID/:flatId",authenticateToken.verifyAuthentication, FlatController.getFlatByID);
router.get("/getAllFlats", FlatController.getAllFlats);
router.patch("/updateFlat/:id",authenticateToken.verifyAuthentication , FlatController.updateFlat);
router.delete("/deleteFlat/:id", authenticateToken.verifyAuthentication ,FlatController.deleteFlat);
router.get("/getMyFlats/:id", (req, res, next) => {
    console.log("Request to /getMyFlats/:id received with ID:", req.params.id);  // Verifică că ruta este apelată corect
    next();
}, authenticateToken.verifyAuthentication, FlatController.getMyFlats);
router.get('/getFavoriteFlats', authenticateToken.verifyAuthentication, FlatController.getFavoriteFlats);

module.exports = router;
