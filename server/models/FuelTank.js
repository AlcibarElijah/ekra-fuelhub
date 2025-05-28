/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const Schema = mongoose.Schema;

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const FuelTankSchema = new Schema({
  fuelType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fuel",
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 25000,
    min: 0,
  },
  deadstock: {
    type: Number,
    required: true,
    default: 1000,
    min: 0,
  },
  acceptableVariance: {
    type: Number,
    required: true,
    default: 200,
    min: 0
  }
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */
module.exports = mongoose.model("FuelTank", FuelTankSchema);
