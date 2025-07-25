// import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fuelDeliveryVolumeSchema = new Schema({
  delivery: {
    type: Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true,
  },
  fuelTank: {
    type: Schema.Types.ObjectId,
    ref: 'FuelTank',
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const FuelDeliveryVolume = mongoose.model(
  'FuelDeliveryVolume',
  fuelDeliveryVolumeSchema
);
module.exports = FuelDeliveryVolume;
