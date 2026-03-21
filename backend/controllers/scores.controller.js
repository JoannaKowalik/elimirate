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

async function revealNext(req, res) {
  try {
    const { roomCode } = req.params;

    await scoreService.revealNext(roomCode);

    res.json({ message: "Reveal successful" });
  } catch (err) {
    console.error(err); // 👈 keep this for debugging
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getScores,
  revealNext,
};
