const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/waterFlowControllers");
// Definisikan route di sini
router.get("/sensor-waterFlow", sensorController.getAllItems);

module.exports = router;
