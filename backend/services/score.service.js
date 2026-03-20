const db = require("../config/db");

function getScores(roomCode) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT players.display_name, contestant.name, episodes.episode_number, eliminations.actual_position, predictions.predicted_position, ABS(eliminations.actual_position - predictions.predicted_position) AS penalty_points FROM predictions JOIN players ON predictions.player_id = players.id JOIN contestants ON predictions.contestant_id = contestants.contestant_id JOIN eliminations ON eliminations.contestant_id = contestants.contestant_id JOIN episodes ON eliminations.episode_id = episodes.id JOIN rooms ON players.room_id = rooms.id JOIN contestant ON predictions.contestant_id = contestant.id WHERE rooms.room_code = ? ORDER BY episodes.episode_number, contestant.id, players.id";

    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);
      const total_scores =
        "SELECT players.display_name, SUM(ABS(eliminations.actual_position - predictions.predicted_position)) AS total_score FROM predictions JOIN players ON predictions.player_id = players.id JOIN contestants ON predictions.contestant_id = contestants.contestant_id JOIN eliminations ON eliminations.contestant_id = contestants.contestant_id JOIN episodes ON eliminations.episode_id = episodes.id JOIN rooms ON players.room_id = rooms.id WHERE rooms.room_code = ? GROUP BY players.display_name ORDER BY total_score";
      db.query(total_scores, [roomCode], (err, totalResults) => {
        if (err) return reject(err);
        resolve({ results, totalResults });
      });
    });
  });
}

function getRevealIndex(roomCode) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT reveal_index FROM reveal JOIN rooms ON reveal.room_id = rooms.id WHERE rooms.room_code = ?";

    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);

      if (!results || results.length === 0) {
        const insertSql = `
          INSERT INTO reveal (room_id, episode_id, reveal_index)
          SELECT rooms.id, episodes.id, 0 FROM rooms WHERE room_code = ?
        `;

        db.query(insertSql, [roomCode], (err) => {
          if (err) return reject(err);

          console.log("Reveal row created for room:", roomCode);
          resolve(0);
        });

        return;
      }

      resolve(results[0].reveal_index || 0);
    });
  });
}

function revealNext(roomId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE reveal SET reveal_index = reveal_index + 1 WHERE room_id = ?";
    db.query(sql, [roomId], (err) => {
      if (err) return reject(err);

      const selectSql = "SELECT reveal_index FROM reveal WHERE room_id = ?";

      db.query(selectSql, [roomId], (err, results) => {
        if (err) return reject(err);
        if (!results || results.length === 0) {
          return resolve(0);
        }
        resolve(results[0].reveal_index);
      });
    });
  });
}

module.exports = {
  getScores,
  getRevealIndex,
  revealNext,
};
