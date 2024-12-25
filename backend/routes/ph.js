const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/phControllers");
// Definisikan route di sini
router.get("/sensor-ph", sensorController.getAllItems);

module.exports = router;
