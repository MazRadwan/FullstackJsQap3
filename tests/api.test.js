const request = require("supertest");
const app = require("../index");

// as a SweatSpot partner , i want to be able to fetch all the fitness_class records
// from the database via REST API. The records will be returned in JSON format.

describe("/api Endpoints", () => {
  let createdClassId;

  test("GET /api/class", async () => {
    const res = await request(app).get("/api/class");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("length");
  });

  test("POST /api/class", async () => {
    const res = await request(app).post("/api/class").send({
      class_name: "Test Pilates",
      instructor: "Test Instructor",
      date: "2024-07-11",
      time: "10:00",
      duration: 45,
      details: "A test pilates session.",
      class_type: "Pilates",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    createdClassId = res.body.id;
  });

  // as a SweatSpot partner , i want to be able to fetch a single fitness_class record via REST API

  test("GET /api/class/:id", async () => {
    const res = await request(app).get(`/api/class/${createdClassId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(createdClassId);
  });

  // as a SweatSpot partner , i want to be able to update a fitness_class record via REST API

  test("PUT /api/class/:id", async () => {
    const res = await request(app).put(`/api/class/${createdClassId}`).send({
      class_name: "Updated Test Pilates",
      instructor: "Test Instructor",
      date: "2024-07-11",
      time: "11:00",
      duration: 60,
      details: "An updated test pilates session.",
      class_type: "Pilates",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.class_name).toBe("Updated Test Pilates");
  });

  // as a SweatSpot partner , i want to be able to update a fitness_class record field via REST API
  test("PATCH /api/class/:id", async () => {
    const res = await request(app)
      .patch(`/api/class/${createdClassId}`)
      .send({ class_name: "Patched Test Pilates" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.class_name).toBe("Patched Test Pilates");
  });

  // as a SweatSpot partner , i want to be able to delete a fitness_class record via REST API

  test("DELETE /api/class/:id", async () => {
    const res = await request(app).delete(`/api/class/${createdClassId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(createdClassId);
  });
});
