const predictionService = require("../services/prediction.service");
const playerService = require("../services/player.service");

async function addPrediction(req, res) {
  try {
    const { roomCode } = req.params;
    const { display_name, predictions } = req.body;
    console.log("Received prediction data:", req.body);

    if (!display_name || !predictions || predictions.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing display name or predictions" });
    }

    const player = await playerService.createPlayer({
      display_name,
      room_code: roomCode,
    });
    console.log("Created player:", player);

    const player_id = player.playerId;

    for (const prediction of predictions) {
      if (!prediction.contestant_id || !prediction.predicted_position) continue;

      await predictionService.addPrediction({
        player_id,
        contestant_id: prediction.contestant_id,
        predicted_position: prediction.predicted_position,
      });
    }

    res.json({
      message: "Prediction added successfully",
    });
  } catch (error) {
    console.error("Error adding prediction:", error);
    res.status(500).json({ message: "Error adding prediction", error });
  }
}

module.exports = {
  addPrediction,
};
