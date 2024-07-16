const request = require("supertest");
const app = require("../index"); // Your Express app

describe("Error Handling", () => {
  test("Handles database connection errors gracefully", async () => {
    // Simulate a database connection error
    jest.spyOn(global.console, "error").mockImplementation(() => {});
    const res = await request(app).get("/simulate-db-error"); // Route to simulate error
    expect(res.statusCode).toEqual(503);
    expect(res.body).toHaveProperty("message", "Service Unavailable");
    console.error.mockRestore();
  });

  test("Returns 404 for non-existent routes", async () => {
    const res = await request(app).get("/non-existent-route");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Route not found");
  });

  test("Handles invalid input data gracefully", async () => {
    const res = await request(app).post("/fitness_classes").send({
      class_name: "", // Invalid data
      instructor: "Bob",
      date: "invalid-date", // Invalid date
      time: "10:00",
      duration: -30, // Invalid duration
      details: "A core-strengthening pilates session.",
      class_type: "Pilates",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Bad Request");
  });

  test("Handles missing query or attribute parameters", async () => {
    const res = await request(app).get("/fitness_classes/search").query({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "message",
      "Query and attribute are required"
    );
  });

  test("Handles non-existent class ID", async () => {
    const res = await request(app).get("/fitness_classes/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Class not found");
  });

  test("Handles error when deleting non-existent class ID", async () => {
    const res = await request(app).delete("/fitness_classes/9999");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Class not found");
  });
});
