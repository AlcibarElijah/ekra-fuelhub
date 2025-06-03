/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const Schema = mongoose.Schema;

/* -------------------------------------------------------------------------- */
/*                                   schema                                   */
/* -------------------------------------------------------------------------- */
const FuelTankReadingVolumeSchema = new Schema({
  reading: {
    type: Schema.ObjectId,
    ref: "FuelTankReading",
    required: true,
  },
  fuelTank: {
    type: Schema.ObjectId,
    ref: "FuelTank",
    required: true,
  },
  volume: {
    type: Number,
    required: true,
    default: 0,
  }
});

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */
module.exports = mongoose.model("FuelTankReadingVolume", FuelTankReadingVolumeSchema);