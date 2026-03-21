const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scores.controller");

router.get("/rooms/:roomCode/scores", scoresController.getScores);
router.post("/rooms/:roomCode/reveal", scoresController.revealNext);

module.exports = router;
