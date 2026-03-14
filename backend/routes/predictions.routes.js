const express = require("express");
const router = express.Router();
const predictionsController = require("../controllers/predictions.controller");

router.post("/:roomCode/predictions", predictionsController.addPrediction);
router.get(
  "/:roomCode/players/:playerId/predictions",
  predictionsController.getPlayerPredictions,
);

module.exports = router;
