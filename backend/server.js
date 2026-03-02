//require("dotenv").config() is used to load environment variables from a .env file, to keep sensitive information out of the source code
require("dotenv").config();
// Import necessary modules
const express = require("express");
const cors = require("cors");
const path = require("path");

const roomsRoutes = require("./routes/rooms.routes");
// Create an instance of the Express application
const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomsRoutes);

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
