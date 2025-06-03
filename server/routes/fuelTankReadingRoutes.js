/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const express = require('express');

/* ------------------------------- controllers ------------------------------ */
const {
  createFuelTankReadings,
  getFuelTankReadings,
  getFuelTankReading,
  updateFuelTankReading,
  deleteFuelTankReading,
} = require('../controllers/fuelTankReadingController');

/* ------------------------------- middleware ------------------------------- */
const { isUserAuthenticated } = require('../middlewares/authMiddleware');

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
router.post('/', createFuelTankReadings);
router.get('/', getFuelTankReadings);
router.get('/:id', getFuelTankReading);
router.put('/:id', updateFuelTankReading);
router.delete('/:id', deleteFuelTankReading);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;
