require("dotenv").config();
const { Pool } = require("pg");
const myEmitter = require("../utils/logEvents");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
    myEmitter.emit("error", "Database", "Database connection error");
  } else {
    console.log("Database connected successfully");
  }
  myEmitter.emit("log", "Database", "Database connected successfully");
});

module.exports = pool;
