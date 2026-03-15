const db = require("../config/db");

function getScores(roomCode) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT players.display_name, contestant.name, episodes.episode_number, eliminations.actual_position, predictions.predicted_position, ABS(eliminations.actual_position - predictions.predicted_position) AS penalty_points FROM predictions JOIN players ON predictions.player_id = players.id JOIN contestants ON predictions.contestant_id = contestants.contestant_id JOIN eliminations ON eliminations.contestant_id = contestants.contestant_id JOIN episodes ON eliminations.episode_id = episodes.id JOIN rooms ON players.room_id = rooms.id JOIN contestant ON predictions.contestant_id = contestant.id WHERE rooms.room_code = ? ORDER BY episodes.episode_number";

    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);

      resolve(results);
    });
  });
}

module.exports = {
  getScores,
};
