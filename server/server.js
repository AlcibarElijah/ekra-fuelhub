/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

/* --------------------------------- routes --------------------------------- */
const roleRoutes = require("./routes/roleRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const fuelTankRoutes = require("./routes/fuelTankRoutes");
const fuelTankReadingRoutes = require("./routes/fuelTankReadingRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
/* ------------------------------ env variables ----------------------------- */
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

/* ------------------------------- express app ------------------------------ */
const app = express();
const allowedOrigins = [
  'http://localhost:3000', // Dev
  'https://ekra-fuelhub-frontend.onrender.com' // Production
];

/* -------------------------------------------------------------------------- */
/*                                  on start                                  */
/* -------------------------------------------------------------------------- */
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Only if you're using cookies/auth headers
}));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to the database.");
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("There was an error connecting to the database.", err);
  });

/* -------------------------------------------------------------------------- */
/*                                 middleware                                 */
/* -------------------------------------------------------------------------- */
app.use(morgan("dev")); // log requests to the console

app.use(express.json()); // parse JSON request bodies

/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
app.use("/api/roles", roleRoutes);
app.use("/api/fuels", fuelRoutes);
app.use("/api/fuel-tanks", fuelTankRoutes);
app.use("/api/fuel-tank-readings", fuelTankReadingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);