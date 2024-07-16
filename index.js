require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const fitnessClassRoutes = require("./routes/api/fitnessClass");
const myEmitter = require("./utils/logEvents");

const app = express();
const PORT = process.env.PORT || 3000;

global.DEBUG = true; // Enable debug mode

// Middleware
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/fitness_classes", fitnessClassRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/staff", (req, res) => {
  res.render("staff");
});

// 404 Handler
app.use((req, res, next) => {
  myEmitter.emit(
    "error",
    "404",
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  res.status(404).render("404", { url: req.originalUrl });
});

// Error Handling Middleware - This should be the last middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  myEmitter.emit("error", "500", `Internal server error: ${err.message}`);
  res.status(500).render("error", { error: "Something went wrong!" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export the app for testing
