const pool = require("../services/db");

// as a sweatSpot staff, i want to be able to insert a new fitness_class record into the database

describe("Database Operations", () => {
  let insertedId;

  test("Insert a new fitness class", async () => {
    const res = await pool.query(
      "INSERT INTO fitness_class (class_name, instructor, date, time, duration, details, class_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        "Yoga",
        "John Doe",
        "2023-07-15",
        "10:00:00",
        60,
        "Beginner friendly yoga class",
        "Yoga",
      ]
    );
    expect(res.rows[0]).toHaveProperty("id");
    insertedId = res.rows[0].id;
  });

  // as a sweatSpot staff, i want to be able to fetch all the fitness_class records from the database

  test("Select fitness classes", async () => {
    const res = await pool.query("SELECT * FROM fitness_class");
    expect(res.rows.length).toBeGreaterThan(0);
  });

  // as a sweatSpot staff, i want to be able to fetch a single fitness_class record from the database

  test("Update a fitness class", async () => {
    const res = await pool.query(
      "UPDATE fitness_class SET class_name = $1 WHERE id = $2 RETURNING *",
      ["Advanced Yoga", insertedId]
    );
    expect(res.rows[0].class_name).toBe("Advanced Yoga");
  });

  //  as a sweatSpot staff, i want to be able to delete a fitness_class record from the database

  test("Delete a fitness class", async () => {
    const res = await pool.query(
      "DELETE FROM fitness_class WHERE id = $1 RETURNING *",
      [insertedId]
    );
    expect(res.rows.length).toBe(1);
  });

  afterAll(async () => {
    await pool.end();
  });
});
