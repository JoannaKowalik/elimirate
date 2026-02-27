//require("dotenv").config() is used to load environment variables from a .env file, to keep sensitive information out of the source code
require("dotenv").config();
// Import necessary modules
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
// Create an instance of the Express application
const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
// Create a connection pool to the MySQL database using environment variables for configuration
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

app.post("/api/rooms", (req, res) => {
  console.log("REQ BODY", req.body);
  const roomCode = generateRoomCode();

  const sql =
    "INSERT INTO rooms (room_code, season_id, moderator_name) VALUES (?, ?, ?)";
  const values = [roomCode, req.body.season_number, req.body.moderator_name];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error creating room");
    }
    res.json({
      message: "Room created successfully",
      roomCode,
      roomId: result.insertId,
    });
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
