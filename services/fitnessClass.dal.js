const pool = require("./db");

const getAllClasses = function (month, year) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM fitness_class";
    let params = [];
    if (month && year) {
      sql =
        "SELECT * FROM fitness_class WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2";
      params = [month, year];
    }
    pool.query(sql, params, (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};

module.exports = {
  getAllClasses,
};
