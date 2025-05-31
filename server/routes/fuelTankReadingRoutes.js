/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const express = require("express");

/* ------------------------------- controllers ------------------------------ */
const {
  createFuelTankReading,
  batchCreateFuelTankReadings,
  getAllFuelTankReadings,
  getSingleFuelTankReading,
  updateFuelTankReading,
  deleteFuelTankReading,
} = require("../controllers/fuelTankReadingController");

/* ------------------------------- middleware ------------------------------- */
const {
  isUserAuthenticated,
} = require("../middlewares/authMiddleware");

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                 middleware                                 */
/* -------------------------------------------------------------------------- */
router.use(isUserAuthenticated);

/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
router.post("/batch", batchCreateFuelTankReadings);
router.post("/", createFuelTankReading);
router.get("/", getAllFuelTankReadings);
router.get("/:id", getSingleFuelTankReading);
router.put("/:id", updateFuelTankReading);
router.delete("/:id", deleteFuelTankReading);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;
