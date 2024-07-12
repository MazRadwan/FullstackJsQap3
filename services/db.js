const { Pool } = require("pg");
const pool = new Pool({
  user: "yourusername",
  host: "localhost",
  database: "classStudio",
  password: "yourpassword",
  port: 5432,
});

module.exports = pool;
