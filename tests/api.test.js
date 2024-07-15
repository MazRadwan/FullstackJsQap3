const request = require("supertest");
const app = require("../index");

describe("/api Endpoints", () => {
  let createdClassId;

  test("GET /api/fitness_classes", async () => {
    const res = await request(app).get("/api/fitness_classes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("length");
  });

  test("POST /api/fitness_classes", async () => {
    const res = await request(app).post("/api/fitness_classes").send({
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

  test("GET /api/fitness_classes/:id", async () => {
    const res = await request(app).get(
      `/api/fitness_classes/${createdClassId}`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(createdClassId);
  });

  test("PUT /api/fitness_classes/:id", async () => {
    const res = await request(app)
      .put(`/api/fitness_classes/${createdClassId}`)
      .send({
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

  test("PATCH /api/fitness_classes/:id", async () => {
    const res = await request(app)
      .patch(`/api/fitness_classes/${createdClassId}`)
      .send({ class_name: "Patched Test Pilates" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.class_name).toBe("Patched Test Pilates");
  });

  test("DELETE /api/fitness_classes/:id", async () => {
    const res = await request(app).delete(
      `/api/fitness_classes/${createdClassId}`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(createdClassId);
  });
});
