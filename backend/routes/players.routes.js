const express = require("express");
const router = express.Router();
const playersController = require("../controllers/players.controller");

router.post("/:roomCode/players", playersController.addPlayer);

router.get("/:roomCode/players/id", playersController.getPlayerIdByNameAndRoom);

module.exports = router;
