const db = require("../config/db");

async function getScores(roomCode) {
  //gets all scores up yo the reveal index/episode number
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
      JOIN reveal ON reveal.room_id = rooms.id  
      JOIN contestant ON predictions.contestant_id = contestant.id 
      WHERE rooms.room_code = ? 
        AND episodes.episode_number <= reveal.reveal_index  
      ORDER BY episodes.episode_number
    `;

  const [results] = await db.query(sql, [roomCode]);

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
        JOIN reveal ON reveal.room_id = rooms.id  
        WHERE rooms.room_code = ? 
          AND episodes.episode_number <= reveal.reveal_index 
        GROUP BY players.display_name 
        ORDER BY total_score
      `;

  const [totalResults] = await db.query(total_scores, [roomCode]);

  return {
    scores: results,
    totalScores: totalResults,
  };
}

async function revealNext(roomCode) {
  const result = await updateReveal(roomCode);

  if (result.affectedRows === 0) {
    //ffunction from mySQL
    throw new Error("Nothing to reveal");
  }

  // Return the current reveal_index after increment
  const revealIndex = await getRevealIndex(roomCode);
  return revealIndex;
}

async function getRevealIndex(roomCode) {
  const sql = `
      SELECT reveal_index
      FROM reveal
      JOIN rooms ON reveal.room_id = rooms.id
      WHERE rooms.room_code = ?
    `;
  const [results] = await db.query(sql, [roomCode]);
  if (!results) {
    return 0;
  } else {
    return results[0].reveal_index;
  }
}

async function updateReveal(roomCode) {
  //increase reveal index on click Reveal Next.Episode numbers are incorrect! Fix db
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

  const [results] = await db.query(sql, [roomCode, roomCode]);
  return results;
}

module.exports = {
  getScores,
  getRevealIndex,
  //updateReveal,
  revealNext,
};
