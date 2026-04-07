const db = require("../config/db");

async function addPrediction({ player_id, contestant_id, predicted_position }) {

    const sql =
      "INSERT INTO predictions (player_id, contestant_id, predicted_position) VALUES (?, ?, ?)";

    const [predictions] = await db.query(
      sql,
      [player_id, contestant_id, predicted_position])
;
        return({
          predictionId: predictions.insertId,
          player_id,
        });
      };

      
module.exports = {
  addPrediction,
};
