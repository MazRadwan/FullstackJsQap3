const request = require("supertest"); // using supertest to test the /api
const app = require("../index");

// as a business partner i want to be able to fetch the fitness classes via /api

describe("/api Endpoints", () => {
  test("GET /api/fitness_classes", async () => {
    const res = await request(app).get("/api/fitness_classes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("length");
  });

  test("POST /api/fitness_classes", async () => {
    const res = await request(app).post("/api/fitness_classes").send({
      class_name: "Pilates",
      instructor: "Bob",
      date: "2024-07-11",
      time: "10:00",
      duration: 45,
      details: "A core-strengthening pilates session.",
      class_type: "Pilates",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  test("GET /api/fitness_classes/:id", async () => {
    const res = await request(app).get("/api/fitness_classes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });

  test("PUT /api/fitness_classes/:id", async () => {
    const res = await request(app).put("/api/fitness_classes/1").send({
      class_name: "Advanced Pilates",
      instructor: "Bob",
      date: "2024-07-11",
      time: "10:00",
      duration: 45,
      details: "An advanced core-strengthening pilates session.",
      class_type: "Pilates",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.class_name).toBe("Advanced Pilates");
  });

  test("PATCH /api/fitness_classes/:id", async () => {
    const res = await request(app)
      .patch("/api/fitness_classes/1")
      .send({ class_name: "Pilates" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.class_name).toBe("Pilates");
  });

  test("DELETE /api/fitness_classes/:id", async () => {
    const res = await request(app).delete("/api/fitness_classes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
});
