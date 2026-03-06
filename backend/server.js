//Load password etc. from .env file to keep out of the code/GitHub
require("dotenv").config();
// Import necessary modules
const express = require("express");
const cors = require("cors");
const path = require("path");
//
const roomsRoutes = require("./routes/rooms.routes");
const playersRoutes = require("./routes/players.routes");
// Create an instance of the Express application
const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/api/rooms/", roomsRoutes);
app.use("/api/rooms", playersRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
