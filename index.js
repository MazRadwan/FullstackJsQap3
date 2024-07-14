const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const fitnessClassRoutes = require("./routes/api/fitnessClass");

const app = express();
const PORT = process.env.PORT || 3000;

global.DEBUG = true; // Enable debug mode

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Ensure this middleware is present
app.use(methodOverride("_method")); // Enable method override
app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
app.use("/api/fitness_classes", fitnessClassRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/staff", (req, res) => {
  res.render("staff");
});

// 404 Page
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing
