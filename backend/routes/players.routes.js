const express = require("express");
const router = express.Router();
const playersController = require("../controllers/players.controller");

router.post("/:roomCode/players", playersController.addPlayer);

router.get("/:roomCode/players/id", playersController.getPlayerIdByNameAndRoom);

router.get("/:roomCode/players/:playerId/predictions", playersController.getPlayerPredictions);

module.exports = router;
