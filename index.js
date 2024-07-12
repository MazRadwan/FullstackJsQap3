const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const fitnessClassRoutes = require("./routes/api/fitnessClass");
const loginRoutes = require("./routes/api/logins");
const userRoutes = require("./routes/api/users");

const app = express();
const PORT = process.env.PORT || 3000;

global.DEBUG = true; // Enable debug mode

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // This is important for form submissions
app.use(methodOverride("_method")); //  important for PUT and DELETE requests

// Routes
app.use("/api/fitness_classes", fitnessClassRoutes);
// app.use("/api/logins", loginRoutes); // implement later
// app.use("/api/users", userRoutes); //implement later

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/staff", (req, res) => {
  res.render("staff");
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing
