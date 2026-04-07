const db = require("../config/db");

async function createPlayer({ display_name, room_code }) {
  
    //get room id from room code
    const getIdFromSql = "SELECT id FROM rooms WHERE room_code = ?";

    const [roomData] = await db.query(getIdFromSql, [room_code]);
      
      if (roomData.length === 0)
         throw new Error("Room not found for code: " + room_code);

      const room_id = roomData[0].id;
      //insert player into database
      const insertSql = "INSERT INTO players (display_name, room_id) VALUES (?, ?)";

     const [result]=await db.query(insertSql, [display_name, room_id]);
       

        return({
          player_id: result.insertId, //insertId comes from mysql 
          display_name,
          room_id,
        });
      }
  
  

  


function getPlayerById(playerId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM players WHERE id = ?";

    db.query(sql, [playerId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      resolve(results[0]);
    });
  });
}

async function getPlayerPredictions(playerId) {
  console.log("Getting predictions for player ID:", playerId);
    const sql =
      "SELECT contestant.name, contestant.id, predictions.predicted_position, players.display_name FROM predictions JOIN contestant ON predictions.contestant_id = contestant.id JOIN players ON predictions.player_id = players.id WHERE predictions.player_id = ? ORDER BY predictions.predicted_position ASC";
    const [results] =await db.query(sql, [playerId]);
    console
      return(results);
    };

async function getPlayerIdByNameAndRoom(display_name, roomCode) {
  
    const sql =
      "SELECT players.id FROM players JOIN rooms ON players.room_id = rooms.id WHERE players.display_name = ? AND rooms.room_code = ?";

    const [results]= await db.query(sql, [display_name, roomCode]);
      return(results[0].id);//return id num
    };

async function getPlayerByNameAndRoom(display_name, roomCode) {
  
    const sql =
      "SELECT players.id FROM players JOIN rooms ON players.room_id = rooms.id WHERE players.display_name = ? AND rooms.room_code = ?";

    const [results] = await db.query(sql, [display_name, roomCode]);
     
      return(results[0]);//return object
    };


async function getPlayersByRoom(roomCode) {
  
    const sql =
      "SELECT players.display_name FROM players JOIN rooms ON players.room_id = rooms.id WHERE rooms.room_code = ?";

    const [results]=await db.query(sql, [roomCode]);
      return(results);
    }

module.exports = {
  createPlayer,
  getPlayerById,
  getPlayerIdByNameAndRoom,
  getPlayerByNameAndRoom,
  getPlayersByRoom,
  getPlayerPredictions,
};
