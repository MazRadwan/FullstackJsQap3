const pool = require("./db");

const getAllClasses = async () => {
  const res = await pool.query("SELECT * FROM fitness_class");
  return res.rows;
};

const getClassById = async (id) => {
  const res = await pool.query("SELECT * FROM fitness_class WHERE id = $1", [
    id,
  ]);
  return res.rows[0];
};

const createClass = async (newClass) => {
  const { class_name, instructor, date, time, duration, details, class_type } =
    newClass;
  const res = await pool.query(
    "INSERT INTO fitness_class (class_name, instructor, date, time, duration, details, class_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [class_name, instructor, date, time, duration, details, class_type]
  );
  return res.rows[0];
};

const updateClass = async (id, updatedClass) => {
  const { class_name, instructor, date, time, duration, details, class_type } =
    updatedClass;
  const res = await pool.query(
    "UPDATE fitness_class SET class_name = $1, instructor = $2, date = $3, time = $4, duration = $5, details = $6, class_type = $7 WHERE id = $8 RETURNING *",
    [class_name, instructor, date, time, duration, details, class_type, id]
  );
  return res.rows[0];
};

const patchClass = async (id, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);
  values.push(id);
  const res = await pool.query(
    `UPDATE fitness_class SET ${fields} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return res.rows[0];
};

const deleteClass = async (id) => {
  const res = await pool.query(
    "DELETE FROM fitness_class WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows[0];
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  patchClass,
  deleteClass,
};
