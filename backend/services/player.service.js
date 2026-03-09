const db = require("../config/db");

function createPlayer({ display_name, room_id }) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO players (display_name, room_id) VALUES (?, ?)";

    db.query(sql, [display_name, room_id], (err, result) => {
      if (err) return reject(err);

      resolve({
        playerId: result.insertId,
      });
    });
  });
}

function getPlayerById(playerId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM players WHERE player_id = ?";

    db.query(sql, [playerId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      resolve(results[0]);
    });
  });
}

module.exports = {
  createPlayer,
  getPlayerById,
};
