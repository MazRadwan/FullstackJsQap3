const express = require("express");
const router = express.Router();
const fitnessClassDal = require("../../services/fitnessClass.dal");
const staffDal = require("../../services/staff.dal");
const myEmitter = require("../../utils/logEvents");

// Route to simulate a database connection error
router.get("/simulate-db-error", (req, res) => {
  console.error("Simulated database connection error");
  res.status(503).json({ message: "Service Unavailable", status: 503 });
});

// GET all fitness classes
router.get("/", async (req, res) => {
  if (DEBUG) console.log("GET /class");
  const { month, year } = req.query;
  if (month && year) {
    // Fetch classes for the calendar
    try {
      const classes = await fitnessClassDal.getAllClasses(month, year);
      res.json(classes);
      myEmitter.emit("log", "getAllClasses", "GET /class");
    } catch (err) {
      console.error("Error fetching classes:", err);
      res.status(503).json({ message: "Service Unavailable", status: 503 });
      myEmitter.emit("error", "getAllClasses", "GET /class");
    }
  } else {
    // Default to fetching all classes
    try {
      const classes = await fitnessClassDal.getAllClasses();
      res.json(classes);
      myEmitter.emit("log", "getAllClasses", "GET /class");
    } catch (err) {
      console.error("Error fetching classes:", err);
      res.status(503).json({ message: "Service Unavailable", status: 503 });
      myEmitter.emit("error", "getAllClasses", "GET /class");
    }
  }
});

// Search for fitness classes
router.get("/search", async (req, res) => {
  if (DEBUG) console.log("GET /class/search");
  const { query, attribute } = req.query;
  if (!query || !attribute) {
    myEmitter.emit(
      "error",
      "searchClasses",
      "GET /class/search - Missing query or attribute"
    );
    return res
      .status(400)
      .json({ message: "Query and attribute are required", status: 400 });
  }
  try {
    const classes = await fitnessClassDal.getClassesByQuery(query, attribute);
    res.json(classes);
    myEmitter.emit("log", "searchClasses", "GET /class/search");
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(503).json({ message: "Service Unavailable", status: 503 });
    myEmitter.emit("error", "searchClasses", "GET /class/search");
  }
});

// Fetch a specific class by ID
router.get("/:id", async (req, res) => {
  try {
    const classData = await staffDal.getClassById(req.params.id);
    if (!classData) {
      myEmitter.emit(
        "error",
        "getClassById",
        `Class not found with id=${req.params.id}`
      );
      return res.status(404).json({ message: "Class not found", status: 404 });
    }
    res.json(classData);
  } catch (err) {
    console.error("Error fetching class:", err);
    myEmitter.emit(
      "error",
      "getClassById",
      `Error fetching class with id=${req.params.id}`
    );
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
});

// Create a new class
router.post("/", async (req, res) => {
  if (DEBUG) console.log("POST /class");
  try {
    const newClass = await staffDal.createClass(req.body);
    res.status(201).json(newClass);
    myEmitter.emit("log", "createClass", "POST /class");
  } catch (err) {
    console.error("Error creating class:", err);
    if (err.message === "Missing required fields") {
      res.status(400).json({ message: "Bad Request", status: 400 });
    } else {
      res.status(400).json({ message: "Bad Request", status: 400 });
    }
    myEmitter.emit("error", "createClass", "POST /class");
  }
});

// Update a class
router.put("/:id", async (req, res) => {
  try {
    const updatedClass = await staffDal.updateClass(req.params.id, req.body);
    res.json(updatedClass);
    myEmitter.emit("log", "updateClass", `PUT /class/${req.params.id}`);
  } catch (err) {
    console.error("Error updating class:", err);
    res.status(400).json({ message: "Bad Request", status: 400 });
    myEmitter.emit("error", "updateClass", `PUT /class/${req.params.id}`);
  }
});

// Patch a class
router.patch("/:id", async (req, res) => {
  try {
    const patchedClass = await staffDal.patchClass(req.params.id, req.body);
    res.json(patchedClass);
    myEmitter.emit("log", "patchClass", `PATCH /class/${req.params.id}`);
  } catch (err) {
    console.error("Error patching class:", err);
    res.status(400).json({ message: "Bad Request", status: 400 });
    myEmitter.emit("error", "patchClass", `PATCH /class/${req.params.id}`);
  }
});

// Delete a class
router.delete("/:id", async (req, res) => {
  if (DEBUG) console.log(`DELETE /class/${req.params.id}`);
  const { id } = req.params;
  try {
    const deletedClass = await fitnessClassDal.deleteClass(id);
    if (deletedClass) {
      res.json(deletedClass);
      myEmitter.emit("log", "deleteClass", `DELETE /class/${id}`);
    } else {
      res.status(404).json({ message: "Class not found", status: 404 });
      myEmitter.emit("error", "deleteClass", `DELETE /class/${id}`);
    }
  } catch (err) {
    console.error("Error deleting class:", err);
    res.status(503).json({ message: "Service Unavailable", status: 503 });
    myEmitter.emit("error", "deleteClass", `DELETE /class/${id}`);
  }
});

module.exports = router;
