const express = require("express");
const router = express.Router();
const fitnessClassDal = require("../../services/fitnessClass.dal");

// Get all fitness classes
router.get("/", async (req, res) => {
  try {
    const classes = await fitnessClassDal.getAllClasses();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a single fitness class by ID
router.get("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const fitnessClass = await fitnessClassDal.getClassById(classId);
    res.json(fitnessClass);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create a new fitness class
router.post("/", async (req, res) => {
  try {
    const newClass = req.body;
    const createdClass = await fitnessClassDal.createClass(newClass);
    res.status(201).json(createdClass);
  } catch (err) {
    res.status(400).json({ errors: err });
  }
});

// Update a fitness class
router.put("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const updatedClass = req.body;
    const result = await fitnessClassDal.updateClass(classId, updatedClass);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Patch a fitness class
router.patch("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const updatedFields = req.body;
    const result = await fitnessClassDal.patchClass(classId, updatedFields);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a fitness class
router.delete("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const result = await fitnessClassDal.deleteClass(classId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
