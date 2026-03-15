const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scores.controller");

router.get("/rooms/:roomCode/scores", scoresController.getScores);

module.exports = router;
