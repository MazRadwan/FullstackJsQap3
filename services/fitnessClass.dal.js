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

const getClassesByQuery = function (query, attribute) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM fitness_class WHERE ${attribute} ILIKE $1`;
    let params = [`%${query}%`];
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

const deleteClass = async (id) => {
  const query = "DELETE FROM fitness_class WHERE id = $1 RETURNING *";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error in deleteClass:", err);
    throw err;
  }
};

module.exports = {
  getAllClasses,
  getClassesByQuery,
  deleteClass,
};
