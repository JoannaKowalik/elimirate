const scoreService = require("../services/score.service");

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

module.exports = {
  getScores,
};
