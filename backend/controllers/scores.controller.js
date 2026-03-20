const scoreService = require("../services/score.service");
const roomService = require("../services/room.service");

async function getScores(req, res) {
  try {
    console.log("Request body:", req.body);

    const roomCode = req.params.roomCode;
    const scores = await scoreService.getScores(roomCode);
    console.log("Fetching scores for room code:", roomCode);
    res.json({
      message: "Scores fetched successfully",
      scores: scores.results || [],
      totalScores: scores.totalResults || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching scores");
  }
}

async function getRevealIndex(req, res) {
  try {
    console.log("Request body:", req.body);

    const roomCode = req.params.roomCode;
    const revealIndex = await scoreService.getRevealIndex(roomCode);
    console.log("Fetching reveal index for room code:", roomCode);
    res.json({
      message: "Reveal index fetched successfully",
      revealIndex,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching reveal index");
  }
}

async function revealNext(req, res) {
  try {
    const roomCode = req.params.roomCode;
    const roomId = await roomService.getRoomIdByCode(roomCode);
    const nextEp = await scoreService.revealNext(roomId);
    res.json({
      message: "Next episode revealed",
      nextEp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching reveal index");
  }
}

module.exports = {
  getScores,
  getRevealIndex,
  revealNext,
};
