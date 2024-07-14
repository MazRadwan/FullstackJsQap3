const express = require("express");
const router = express.Router();
const fitnessClassDal = require("../../services/fitnessClass.dal");
const staffDal = require("../../services/staff.dal");

// GET all fitness classes
router.get("/", async (req, res) => {
  const { month, year } = req.query;
  if (month && year) {
    // Fetch classes for the calendar
    try {
      const classes = await fitnessClassDal.getAllClasses(month, year);
      res.json(classes);
    } catch (err) {
      console.error("Error fetching classes:", err);
      res.status(503).json({ message: "Service Unavailable", status: 503 });
    }
  } else {
    // Default to fetching all classes
    try {
      const classes = await fitnessClassDal.getAllClasses();
      res.json(classes);
    } catch (err) {
      console.error("Error fetching classes:", err);
      res.status(503).json({ message: "Service Unavailable", status: 503 });
    }
  }
});

// Search for fitness classes
router.get("/search", async (req, res) => {
  const { query, attribute } = req.query;
  if (!query || !attribute) {
    return res
      .status(400)
      .json({ message: "Query and attribute are required", status: 400 });
  }
  console.log(
    `Received search request: query=${query}, attribute=${attribute}`
  );
  try {
    const classes = await staffDal.getClassesByQuery(query, attribute);
    res.json(classes);
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(503).json({ message: "Service Unavailable", status: 503 });
  }
});

// Fetch a specific class by ID
router.get("/:id", async (req, res) => {
  try {
    const classData = await staffDal.getClassById(req.params.id);
    res.json(classData);
  } catch (err) {
    console.error("Error fetching class:", err);
    res.status(404).json({ message: "Class not found", status: 404 });
  }
});

// Other routes for creating, updating, and patching classes using staffDal
router.post("/", async (req, res) => {
  try {
    const newClass = await staffDal.createClass(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    console.error("Error creating class:", err);
    res.status(400).json({ message: "Bad Request", status: 400 });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedClass = await staffDal.updateClass(req.params.id, req.body);
    res.json(updatedClass);
  } catch (err) {
    console.error("Error updating class:", err);
    res.status(400).json({ message: "Bad Request", status: 400 });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const patchedClass = await staffDal.patchClass(req.params.id, req.body);
    res.json(patchedClass);
  } catch (err) {
    console.error("Error patching class:", err);
    res.status(400).json({ message: "Bad Request", status: 400 });
  }
});

module.exports = router;
