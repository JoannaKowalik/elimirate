const db = require("../config/db");

function addPrediction({ player_id, contestant_id, predicted_position }) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO predictions (player_id, contestant_id, predicted_position) VALUES (?, ?, ?)";

    db.query(
      sql,
      [player_id, contestant_id, predicted_position],
      (err, result) => {
        if (err) return reject(err);

        resolve({
          predictionId: result.insertId,
        });
      },
    );
  });
}
module.exports = {
  addPrediction,
};
