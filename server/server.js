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

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});
