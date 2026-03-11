const express = require("express");
const router = express.Router();
const predictionsController = require("../controllers/predictions.controller");

router.post("/:roomCode/predictions", predictionsController.addPrediction);

module.exports = router;
