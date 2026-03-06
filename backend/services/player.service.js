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

module.exports = {
  createPlayer,
};
