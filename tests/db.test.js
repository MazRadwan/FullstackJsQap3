const { Pool } = require("pg");
const pool = new Pool({
  user: "yourusername",
  host: "localhost",
  database: "classStudio",
  password: "yourpassword",
  port: 5432,
});
//As a  staff member user, I want to be able to add a new fitness class to the schedule.
describe("Database Operations", () => {
  test("Insert a new fitness class", async () => {
    const res = await pool.query(
      "INSERT INTO fitness_class (class_name, instructor, date, time, duration, details, class_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        "Yoga",
        "Alice",
        "2024-07-10",
        "09:00",
        60,
        "A relaxing yoga class.",
        "Yoga",
      ]
    );
    expect(res.rows[0]).toHaveProperty("id");
  });

  //As a staff member user, I want to be able to update the details of a fitness class.

  test("Select fitness classes", async () => {
    const res = await pool.query("SELECT * FROM fitness_class");
    expect(res.rows.length).toBeGreaterThan(0);
  });

  //As a staff member user, I want to be able to update the details of a fitness class.

  test("Update a fitness class", async () => {
    const res = await pool.query(
      "UPDATE fitness_class SET class_name = $1 WHERE id = $2 RETURNING *",
      ["Advanced Yoga", 1]
    );
    expect(res.rows[0].class_name).toBe("Advanced Yoga");
  });

  //As a staff member user, I want to be able to delete a fitness class from the schedule.

  test("Delete a fitness class", async () => {
    const res = await pool.query(
      "DELETE FROM fitness_class WHERE id = $1 RETURNING *",
      [1]
    );
    expect(res.rows.length).toBe(1);
  });
});
