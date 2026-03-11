const db = require("../config/db");

function createPlayer({ display_name, room_code }) {
  return new Promise((resolve, reject) => {
    //get room id from room code
    const getRoomSql = "SELECT id FROM rooms WHERE room_code = ?";

    db.query(getRoomSql, [room_code], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0)
        return reject(new Error("Room not found for code: " + room_code));

      const room_id = results[0].id;
      //insert player into database
      const sql = "INSERT INTO players (display_name, room_id) VALUES (?, ?)";

      db.query(sql, [display_name, room_id], (err, result) => {
        if (err) return reject(err);

        resolve({
          playerId: result.insertId,
          display_name,
          room_id,
        });
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
