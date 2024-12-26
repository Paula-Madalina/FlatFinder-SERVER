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
router.post('/favorite/:flatId', authenticateToken.verifyAuthentication, FlatController.toggleFavoriteFlat);
router.get('/getFavoriteFlats/:userId', authenticateToken.verifyAuthentication, FlatController.getFavoriteFlats);
router.delete('/removeFavorite/:flatId', authenticateToken.verifyAuthentication, FlatController.removeFromFavorites);

router.get("/flatByUserId/:userId", FlatController.flatByUserId);
router.get('/flatsCount/:userId', FlatController.flatsCount)

module.exports = router;
