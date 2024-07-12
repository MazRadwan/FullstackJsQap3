const request = require("supertest"); // using supertest to test the API
const app = require("../index"); // Your Express app

// as a business partner i want to be able to fetch the fitness classes via api

describe("API Endpoints", () => {
  test("GET /fitness_classes", async () => {
    const res = await request(app).get("/fitness_classes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("length");
  });

  test("POST /fitness_classes", async () => {
    const res = await request(app).post("/fitness_classes").send({
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

  test("GET /fitness_classes/:id", async () => {
    const res = await request(app).get("/fitness_classes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });

  test("PUT /fitness_classes/:id", async () => {
    const res = await request(app).put("/fitness_classes/1").send({
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

  test("PATCH /fitness_classes/:id", async () => {
    const res = await request(app)
      .patch("/fitness_classes/1")
      .send({ class_name: "Pilates" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.class_name).toBe("Pilates");
  });

  test("DELETE /fitness_classes/:id", async () => {
    const res = await request(app).delete("/fitness_classes/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
  });
});
