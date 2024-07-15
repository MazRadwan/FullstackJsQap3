const pool = require("./db");

const getClassById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM fitness_class WHERE id = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

const getClassesByQuery = function (query, attribute) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM fitness_class WHERE ${attribute} ILIKE $1`;
    pool.query(sql, [`%${query}%`], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};

const createClass = function (newClass) {
  return new Promise((resolve, reject) => {
    const {
      class_name,
      instructor,
      date,
      time,
      duration,
      details,
      class_type,
    } = newClass;

    if (
      !class_name ||
      !instructor ||
      !date ||
      !time ||
      !duration ||
      !class_type
    ) {
      return reject(new Error("Missing required fields"));
    }

    const sql = `
      INSERT INTO fitness_class 
      (class_name, instructor, date, time, duration, details, class_type) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;

    const values = [
      class_name,
      instructor,
      date,
      time,
      duration,
      details,
      class_type,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error in createClass:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

const updateClass = function (id, updatedClass) {
  const { class_name, instructor, date, time, duration, details, class_type } =
    updatedClass;
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE fitness_class SET class_name = $1, instructor = $2, date = $3, time = $4, duration = $5, details = $6, class_type = $7 WHERE id = $8 RETURNING *";
    pool.query(
      sql,
      [class_name, instructor, date, time, duration, details, class_type, id],
      (err, result) => {
        if (err) {
          console.error("Error in updateClass:", err);
          reject(err);
        } else {
          resolve(result.rows[0]);
        }
      }
    );
  });
};

const patchClass = function (id, updatedFields) {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);
  values.push(id);
  return new Promise((resolve, reject) => {
    const sql = `UPDATE fitness_class SET ${fields} WHERE id = $${values.length} RETURNING *`;
    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error in patchClass:", err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

const deleteClass = function (id) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM fitness_class WHERE id = $1 RETURNING *";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error in deleteClass:", err);
        reject(err);
      } else {
        if (result.rows.length === 0) {
          console.log(`No class found with id ${id} to delete.`);
          resolve(null); // No class found with this id
        } else {
          console.log(
            `Successfully deleted class with id ${id}:`,
            result.rows[0]
          );
          resolve(result.rows[0]); // Return the deleted class data
        }
      }
    });
  });
};

module.exports = {
  getClassById,
  getClassesByQuery,
  createClass,
  updateClass,
  patchClass,
  deleteClass,
};
