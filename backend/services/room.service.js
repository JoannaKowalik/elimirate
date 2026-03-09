const db = require("../config/db");
const generateRoomCode = require("../utils/generateRoomCode");
//const createPlayer = require("./player.service").createPlayer;

function createRoom({ season_number, moderator_name }) {
  //don't pass season id but rather pull from seasons table based on season number???
  return new Promise((resolve, reject) => {
    const roomCode = generateRoomCode();

    const insertRoomSql =
      "INSERT INTO rooms (room_code, season_id) VALUES (?, ?)";
    //callback hrll
    db.query(insertRoomSql, [roomCode, season_number], (err, roomResult) => {
      if (err) return reject(err);

      const roomId = roomResult.insertId;

      const insertPlayerSql =
        "INSERT INTO players (room_id, display_name) VALUES (?, ?)";

      db.query(
        insertPlayerSql,
        [roomId, moderator_name],
        (err, playerResult) => {
          if (err) return reject(err);

          const playerId = playerResult.insertId;

          const updateRoomSql =
            "UPDATE rooms SET moderator_player = ? WHERE id = ?";

          db.query(updateRoomSql, [playerId, roomId], (err) => {
            if (err) return reject(err);

            resolve({
              roomId,
              roomCode,
              moderator_player: {
                id: playerId,
                display_name: moderator_name,
              },
            });
          });
        },
      );
    });
  });
}

function getRoomByCode(roomCode) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM rooms WHERE room_code = ?";

    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      resolve(results[0]);
    });
  });
}

/*

function getRoomSeason(roomId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.*
      FROM seasons s
      JOIN rooms r ON s.id = r.season_id
      WHERE r.room_id = ?
    `;

    db.query(sql, [roomId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      resolve(results[0]);
    });
  });
}

*/

function getContestantsByRoomId(roomId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT contestant.name FROM contestant
  JOIN contestants ON contestants.contestant_id = contestant.id
  JOIN rooms ON contestants.season_id = rooms.season_id
  WHERE rooms.room_code = ?`; //add photo to database?

    db.query(sql, [roomId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve([]); //return empty array
      resolve(results);
    });
  });
}
module.exports = {
  createRoom,
  getRoomByCode,
  //getRoomSeason,
  getContestantsByRoomId,
};
