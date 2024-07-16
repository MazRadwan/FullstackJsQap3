const pool = require("./db");
const myEmitter = require("../utils/logEvents");

const getAllClasses = function (month, year) {
  if (DEBUG) console.log("DAL: getAllClasses called");
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
        myEmitter.emit("error", "getAllClasses", "Database query error");
        reject(err);
      } else {
        myEmitter.emit(
          "log",
          "getAllClasses",
          "Successfully retrieved all classes"
        );
        resolve(result.rows);
      }
    });
  });
};

const getClassesByQuery = function (query, attribute) {
  if (DEBUG)
    console.log(
      `DAL: getClassesByQuery called with query=${query}, attribute=${attribute}`
    );
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM fitness_class WHERE ${attribute} ILIKE $1`;
    let params = [`%${query}%`];
    pool.query(sql, params, (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        myEmitter.emit("error", "getClassesByQuery", "Database query error");
        reject(err);
      } else {
        myEmitter.emit(
          "log",
          "getClassesByQuery",
          `Successfully retrieved classes matching ${attribute}`
        );
        resolve(result.rows);
      }
    });
  });
};

const deleteClass = async (id) => {
  if (DEBUG) console.log(`DAL: deleteClass called with id=${id}`);
  const query = "DELETE FROM fitness_class WHERE id = $1 RETURNING *";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      myEmitter.emit(
        "log",
        "deleteClass",
        `Successfully deleted class with id=${id}`
      );
      return result.rows[0];
    } else {
      myEmitter.emit("error", "deleteClass", `No class found with id=${id}`);
      return null;
    }
  } catch (err) {
    console.error("Error in deleteClass:", err);
    myEmitter.emit("error", "deleteClass", "Database delete error");
    throw err;
  }
};

module.exports = {
  getAllClasses,
  getClassesByQuery,
  deleteClass,
};
