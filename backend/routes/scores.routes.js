const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scores.controller");

router.get("/rooms/:roomCode/scores", scoresController.getScores);
router.post("/rooms/:roomCode/reveal-next", scoresController.revealNext);
router.get("/rooms/:roomCode/reveal-index", scoresController.getRevealIndex);

module.exports = router;
