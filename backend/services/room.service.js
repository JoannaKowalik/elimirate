const db = require("../config/db");
const generateRoomCode = require("../utils/generateRoomCode");
//const createPlayer = require("./player.service").createPlayer;



async function createRoom({ season_number, moderator_name }) {
  const roomCode = generateRoomCode();
  console.log("Generated room code:", roomCode);
  const insertRoomSql =
    "INSERT INTO rooms (room_code, season_id) VALUES (?, ?)";

  const [roomRes] = await db.query(insertRoomSql, [roomCode, season_number]);

  const roomId = roomRes.insertId;

  console.log("Inserted room with ID:", roomId);
  const insertRevealSql =
    "INSERT INTO reveal (room_id, reveal_index) VALUES (?, 0)";

  const [insertReveal] = await db.query(insertRevealSql, [roomId]); //remove vaeiable name?

  const insertPlayerSql =
    "INSERT INTO players (room_id, display_name) VALUES (?, ?)";

  const [insertPlayer] = await db.query(insertPlayerSql, [
    roomId,
    moderator_name,
  ]);

  const playerId = insertPlayer.insertId;

  const updateRoomSql = "UPDATE rooms SET moderator_player = ? WHERE id = ?";

  const [updateRoom] = await db.query(updateRoomSql, [playerId, roomId]); //remove vaeiable name?

  return {
    roomId,
    roomCode,
    moderator_player: {
      id: playerId,
      display_name: moderator_name,
    },
  };
}

async function getRoomByCode(roomCode) {
console.log("Getting room by code:", roomCode);
    const sql = "SELECT * FROM rooms WHERE room_code = ?";

    const [res]= await db.query(sql, [roomCode]);
console.log("getRoomByCode result:", res);
      return(res[0]);
};



async function getContestantsByRoomCode(roomCode) {
  console.log("Getting contestants for room code:", roomCode);
  const sql = `SELECT contestant.name, contestant.id FROM contestant
  JOIN contestants ON contestants.contestant_id = contestant.id
  JOIN rooms ON contestants.season_id = rooms.season_id
  WHERE rooms.room_code = ?`; //add photo to database?

  const [results] = await db.query(sql, [roomCode]);

 console.log("contestants results: ", results);
  return results;
}
module.exports = {
  createRoom,
  getRoomByCode,
  //getRoomSeason,
  getContestantsByRoomCode,
};
