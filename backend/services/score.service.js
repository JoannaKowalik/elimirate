const db = require("../config/db");

/*
function getScores(roomCode) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT players.display_name, contestant.name, episodes.episode_number, eliminations.actual_position, predictions.predicted_position, ABS(eliminations.actual_position - predictions.predicted_position) AS penalty_points FROM predictions JOIN players ON predictions.player_id = players.id JOIN contestants ON predictions.contestant_id = contestants.contestant_id JOIN eliminations ON eliminations.contestant_id = contestants.contestant_id JOIN episodes ON eliminations.episode_id = episodes.id JOIN rooms ON players.room_id = rooms.id JOIN contestant ON predictions.contestant_id = contestant.id WHERE rooms.room_code = ? ORDER BY episodes.episode_number";

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
}*/

function getScores(roomCode) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        players.display_name, 
        contestant.name, 
        episodes.episode_number, 
        eliminations.actual_position, 
        predictions.predicted_position, 
        ABS(eliminations.actual_position - predictions.predicted_position) AS penalty_points 
      FROM predictions 
      JOIN players ON predictions.player_id = players.id 
      JOIN contestants ON predictions.contestant_id = contestants.contestant_id 
      JOIN eliminations ON eliminations.contestant_id = contestants.contestant_id 
      JOIN episodes ON eliminations.episode_id = episodes.id 
      JOIN rooms ON players.room_id = rooms.id 
      JOIN reveal ON reveal.room_id = rooms.id   -- ✅ ADD THIS
      JOIN contestant ON predictions.contestant_id = contestant.id 
      WHERE rooms.room_code = ? 
        AND episodes.episode_number <= reveal.reveal_index  -- ✅ ADD THIS
      ORDER BY episodes.episode_number
    `;

    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);

      const total_scores = `
        SELECT 
          players.display_name, 
          SUM(ABS(eliminations.actual_position - predictions.predicted_position)) AS total_score 
        FROM predictions 
        JOIN players ON predictions.player_id = players.id 
        JOIN contestants ON predictions.contestant_id = contestants.contestant_id 
        JOIN eliminations ON eliminations.contestant_id = contestants.contestant_id 
        JOIN episodes ON eliminations.episode_id = episodes.id 
        JOIN rooms ON players.room_id = rooms.id 
        JOIN reveal ON reveal.room_id = rooms.id   -- ✅ ADD THIS
        WHERE rooms.room_code = ? 
          AND episodes.episode_number <= reveal.reveal_index  -- ✅ ADD THIS
        GROUP BY players.display_name 
        ORDER BY total_score
      `;

      db.query(total_scores, [roomCode], (err, totalResults) => {
        if (err) return reject(err);

        resolve({
          scores: results,
          totalScores: totalResults,
        });
      });
    });
  });
}

//get reveal index. no???
/*
function getRevealIndex(roomCode, episodeId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT reveal_index FROM reveal JOIN rooms ON reveal.room_id = rooms.id WHERE rooms.room_code = ? AND reveal.episode_id";

    db.query(sql, [roomCode, episodeId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]?.reveal_index ?? 0);
    });
  });
}
//no???
function updateReveal(roomCode, episodeId) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE reveal JOIN rooms ON reveal.room_id = rooms.id SET reveal_index = reveal_index + 1 WHERE rooms.room_code = ? AND reveal.episode_id = ?";
    db.query(sql, [roomCode, episodeId], (err, results) => {
      if (err) return reject(err);
      resolve({ results });
    });
  });
}*/

async function revealNext(roomCode) {
  const result = await updateRevealSafe(roomCode);

  if (result.affectedRows === 0) {
    throw new Error("Nothing to reveal or already complete");
  }

  // Return the current reveal_index after increment
  const revealIndex = await getRevealIndex(roomCode);
  return revealIndex;
}

function getRevealIndex(roomCode) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT reveal_index
      FROM reveal
      JOIN rooms ON reveal.room_id = rooms.id
      WHERE rooms.room_code = ?
    `;
    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]?.reveal_index ?? 0);
    });
  });
}

function updateRevealSafe(roomCode) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE reveal
      SET reveal_index = reveal_index + 1
      WHERE room_id = (
        SELECT id FROM rooms WHERE room_code = ?
      )
      AND reveal_index < (
        SELECT COUNT(*) 
        FROM episodes 
        WHERE season_id = (
          SELECT season_id FROM rooms WHERE room_code = ?
        )
      )
    `;

    db.query(sql, [roomCode, roomCode], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = {
  getScores,
  getRevealIndex,
  //updateReveal,
  revealNext,
};
