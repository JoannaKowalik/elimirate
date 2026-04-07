const predictionService = require("../services/prediction.service");
const playerService = require("../services/player.service");

async function addPrediction(req, res) {
  try {
    const { roomCode } = req.params;
    const { display_name, predictions, moderator_name } = req.body;
    console.log("Received prediction data:", req.body);

    /*if (!display_name || !predictions || predictions.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing display name or predictions" });
    }*/
    //if passed moderator name, don't create player, just add predictions to existing moderator player id

    let player;

    if (!moderator_name) {
      player = await playerService.createPlayer({
        display_name,
        room_code: roomCode,
      });
      console.log("Created player:", player);
    } else {
      player = await playerService.getPlayerByNameAndRoom(
        moderator_name,
        roomCode,
      );
    }

    const player_id = player.id || player.player_id; // Handle both player or moderator id

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
      player_id: player_id,
    });
  } catch (error) {
    console.error("Error adding prediction:", error);
    res.status(500).json({ message: "Error adding prediction", error });
  }
}

async function getPlayerPredictions(req, res) {
  try {
    const { playerId } = req.params;
    const predictions = await playerService.getPlayerPredictions(playerId);
    const player = await playerService.getPlayerById(playerId);

    res.json({
      predictions,
      display_name: player.display_name,
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ message: "Error fetching predictions", error });
  }
}

module.exports = {
  addPrediction,
  getPlayerPredictions,
};
