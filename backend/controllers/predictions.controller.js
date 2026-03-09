const roomService = require("../services/room.service");
const predictionService = require("../services/prediction.service");

async function addPrediction(req, res) {
    try {
        const { player_id, contestant_id, predicted_position } = req.body;

        const prediction = await predictionService.addPrediction({
            player_id,
            contestant_id,
            predicted_position,
        });

        res.json({
            message: "Prediction added successfully",
            ...prediction,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding prediction", error });
    }

} 

module.exports = {
    addPrediction,
};