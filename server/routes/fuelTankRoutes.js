/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const express = require("express");

/* ------------------------------- controllers ------------------------------ */
const {
  createFuelTank,
  getAllFuelTanks,
  getSingleFuelTank,
  updateFuelTank,
  deleteFuelTank,
} = require("../controllers/fuelTankController");

/* ------------------------------- middleware ------------------------------- */
const {
  isUserAuthenticated,
  isUserAdmin,
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
router.post("/", createFuelTank);
router.get("/", getAllFuelTanks);
router.get("/:id", getSingleFuelTank);
router.put("/:id", updateFuelTank);
router.delete("/:id", isUserAdmin, deleteFuelTank);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;
