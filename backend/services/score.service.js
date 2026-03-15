function getScore(roomCode) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM rooms WHERE room_code = ?";

    db.query(sql, [roomCode], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      resolve(results[0]);
    });
  });
}
