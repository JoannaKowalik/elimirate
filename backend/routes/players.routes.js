const express = require("express");
const router = express.Router();
const playersController = require("../controllers/players.controller");

router.post("/:roomCode/players", playersController.addPlayer);

module.exports = router;
