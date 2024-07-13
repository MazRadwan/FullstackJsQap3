const pool = require("./db");

const getAllClasses = function () {
  if (DEBUG) console.log("fitnessClass.pg.dal.getAllClasses()");
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM fitness_class";
    console.log("Executing SQL:", sql);
    pool.query(sql, [], (err, result) => {
      if (err) {
        console.error("Error in getAllClasses:", err);
        reject(err);
      } else {
        console.log("Retrieved rows:", result.rows);
        resolve(result.rows);
      }
    });
  });
};

const getClassById = function (id) {
  if (DEBUG) console.log("fitnessClass.pg.dal.getClassById()");
  return new Promise(function (resolve, reject) {
    const sql = "SELECT * FROM fitness_class WHERE id = $1";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        if (DEBUG) console.log(err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

const createClass = function (newClass) {
  if (DEBUG) console.log("fitnessClass.pg.dal.createClass()", newClass);

  return new Promise(function (resolve, reject) {
    // Destructure and validate the input
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

    console.log("Executing SQL:", sql);
    console.log("With values:", values);

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error in createClass:", err);
        // Log more details about the error
        if (err.code === "23505") {
          console.error("Unique constraint violation. Duplicate entry.");
        } else if (err.code === "23502") {
          console.error(
            "Not-null constraint violation. Missing required field."
          );
        }
        reject(err);
      } else {
        if (result.rows && result.rows.length > 0) {
          console.log("Inserted row:", result.rows[0]);
          resolve(result.rows[0]);
        } else {
          console.error("No rows returned after insert");
          reject(new Error("Insert did not return any rows"));
        }
      }
    });
  });
};

const updateClass = function (id, updatedClass) {
  if (DEBUG) console.log("fitnessClass.pg.dal.updateClass()");
  const { class_name, instructor, date, time, duration, details, class_type } =
    updatedClass;
  return new Promise(function (resolve, reject) {
    const sql =
      "UPDATE fitness_class SET class_name = $1, instructor = $2, date = $3, time = $4, duration = $5, details = $6, class_type = $7 WHERE id = $8 RETURNING *";
    pool.query(
      sql,
      [class_name, instructor, date, time, duration, details, class_type, id],
      (err, result) => {
        if (err) {
          if (DEBUG) console.log(err);
          reject(err);
        } else {
          resolve(result.rows[0]);
        }
      }
    );
  });
};

const patchClass = function (id, updatedFields) {
  if (DEBUG) console.log("fitnessClass.pg.dal.patchClass()");
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);
  values.push(id);
  return new Promise(function (resolve, reject) {
    const sql = `UPDATE fitness_class SET ${fields} WHERE id = $${values.length} RETURNING *`;
    pool.query(sql, values, (err, result) => {
      if (err) {
        if (DEBUG) console.log(err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

const deleteClass = function (id) {
  if (DEBUG) console.log("fitnessClass.pg.dal.deleteClass()");
  return new Promise(function (resolve, reject) {
    const sql = "DELETE FROM fitness_class WHERE id = $1 RETURNING *";
    pool.query(sql, [id], (err, result) => {
      if (err) {
        if (DEBUG) console.log(err);
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  patchClass,
  deleteClass,
};
