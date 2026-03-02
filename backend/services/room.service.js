const db = require("../config/db");
const generateRoomCode = require("../utils/generateRoomCode");

function createRoom({ season_number, moderator_name }) {
  return new Promise((resolve, reject) => {
    const roomCode = generateRoomCode();

    const sql =
      "INSERT INTO rooms (room_code, season_id, moderator_name) VALUES (?, ?, ?)";

    db.query(sql, [roomCode, season_number, moderator_name], (err, result) => {
      if (err) return reject(err);

      resolve({
        roomCode,
        roomId: result.insertId,
      });
    });
  });
}

module.exports = {
  createRoom,
};
