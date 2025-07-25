/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const express = require('express');

/* ------------------------------- controllers ------------------------------ */
const {
  createFuelDelivery,
  getFuelDeliveries,
  getSingleFuelDelivery,
  updateFuelDelivery,
  deleteFuelDelivery,
} = require('../controllers/fuelDeliveryController');

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
router.post('/', createFuelDelivery);
router.get('/', getFuelDeliveries);
router.get('/:id', getSingleFuelDelivery);
router.put('/:id', updateFuelDelivery);
router.delete('/:id', deleteFuelDelivery);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;
