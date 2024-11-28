let MessagesController = require("../controllers/MessageController");
let express = require("express");
let router = express.Router();
let authMiddleware = require("../middlewares/authMiddleware");
let flatMiddleware = require("../middlewares/flatMiddleware");

router.post("/addMessage/:id",authMiddleware.verifyAuthentication, flatMiddleware.checkFlat, MessagesController.addMessage);
router.get("/getUserMessages/:id",authMiddleware.verifyAuthentication, flatMiddleware.checkFlat, MessagesController.getUserMessages);
router.get("/getAllMessages/:id",authMiddleware.verifyAuthentication,MessagesController.getAllMessages);

module.exports = router;