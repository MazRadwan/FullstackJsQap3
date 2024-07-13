const express = require("express");
const router = express.Router();
const fitnessClassDal = require("../../services/fitnessClass.dal");

// GET all fitness classes
router.get("/", async (req, res) => {
  if (DEBUG) console.log("ROUTE: /api/fitness_classes/ GET " + req.url);
  try {
    const classes = await fitnessClassDal.getAllClasses();
    console.log("Retrieved classes:", classes);
    res.json(classes);
  } catch (err) {
    console.error("Error in GET /api/fitness_classes:", err);
    res
      .status(503)
      .json({
        message: "Service Unavailable",
        status: 503,
        error: err.message,
      });
  }
});

// GET a single fitness class by ID
router.get("/:id", async (req, res) => {
  if (DEBUG) console.log("ROUTE: /api/fitness_classes/:id GET " + req.url);
  try {
    const fitnessClass = await fitnessClassDal.getClassById(req.params.id);
    if (!fitnessClass) {
      res.status(404).json({ message: "Not Found", status: 404 });
    } else {
      res.json(fitnessClass);
    }
  } catch (err) {
    console.error("Error in GET /api/fitness_classes/:id:", err);
    res
      .status(503)
      .json({
        message: "Service Unavailable",
        status: 503,
        error: err.message,
      });
  }
});

// POST create a new fitness class
router.post("/", async (req, res) => {
  if (DEBUG) console.log("ROUTE: /api/fitness_classes/ POST", req.body);
  try {
    const newClass = req.body;

    // Validate required fields
    const requiredFields = [
      "class_name",
      "instructor",
      "date",
      "time",
      "duration",
      "details",
      "class_type",
    ];
    const missingFields = requiredFields.filter((field) => !newClass[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
          status: 400,
        });
    }

    const createdClass = await fitnessClassDal.createClass(newClass);
    console.log("Created class:", createdClass);
    res
      .status(201)
      .json({ message: "Created", status: 201, data: createdClass });
  } catch (err) {
    console.error("Error in POST /api/fitness_classes:", err);
    res
      .status(503)
      .json({
        message: "Service Unavailable",
        status: 503,
        error: err.message,
      });
  }
});

// PUT update a fitness class
router.put("/:id", async (req, res) => {
  if (DEBUG) console.log("ROUTE: /api/fitness_classes PUT " + req.params.id);
  try {
    const updatedClass = req.body;
    const result = await fitnessClassDal.updateClass(
      req.params.id,
      updatedClass
    );
    if (result) {
      res.status(200).json({ message: "Updated", status: 200, data: result });
    } else {
      res.status(404).json({ message: "Not Found", status: 404 });
    }
  } catch (err) {
    console.error("Error in PUT /api/fitness_classes/:id:", err);
    res
      .status(503)
      .json({
        message: "Service Unavailable",
        status: 503,
        error: err.message,
      });
  }
});

// PATCH partially update a fitness class
router.patch("/:id", async (req, res) => {
  if (DEBUG) console.log("ROUTE: /api/fitness_classes PATCH " + req.params.id);
  try {
    const updatedFields = req.body;
    const result = await fitnessClassDal.patchClass(
      req.params.id,
      updatedFields
    );
    if (result) {
      res
        .status(200)
        .json({ message: "Partially Updated", status: 200, data: result });
    } else {
      res.status(404).json({ message: "Not Found", status: 404 });
    }
  } catch (err) {
    console.error("Error in PATCH /api/fitness_classes/:id:", err);
    res
      .status(503)
      .json({
        message: "Service Unavailable",
        status: 503,
        error: err.message,
      });
  }
});

// DELETE a fitness class
router.delete("/:id", async (req, res) => {
  if (DEBUG) console.log("ROUTE: /api/fitness_classes DELETE " + req.params.id);
  try {
    const result = await fitnessClassDal.deleteClass(req.params.id);
    if (result) {
      res.status(200).json({ message: "Deleted", status: 200, data: result });
    } else {
      res.status(404).json({ message: "Not Found", status: 404 });
    }
  } catch (err) {
    console.error("Error in DELETE /api/fitness_classes/:id:", err);
    res
      .status(503)
      .json({
        message: "Service Unavailable",
        status: 503,
        error: err.message,
      });
  }
});

module.exports = router;
