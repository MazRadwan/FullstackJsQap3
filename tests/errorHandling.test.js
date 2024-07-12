const request = require("supertest");
const app = require("../index"); // Your Express app

//as a dev , i want to test scenarios such as database connection errors, non-existent routes, and invalid input data.

describe("Error Handling", () => {
  test("Handles database connection errors gracefully", async () => {
    // Simulate a database connection error
    jest.spyOn(global.console, "error").mockImplementation(() => {});
    const res = await request(app).get("/simulate-db-error"); // Route to simulate error
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message", "Internal Server Error");
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
    expect(res.body).toHaveProperty("errors");
  });
});
