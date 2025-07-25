// import
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fuelDeliverySchema = new Schema({
  dateOrdered: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  dateDelivered: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'delivered', 'cancelled'],
    required: true,
  },
  paymentDueDate: {
    type: Date,
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
    required: true,
  },
});

const FuelDelivery = mongoose.model('FuelDelivery', fuelDeliverySchema);
module.exports = FuelDelivery;
