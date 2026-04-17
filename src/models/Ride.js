const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bargainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bargaining',
      default: null,
    },
    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoff: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    acceptedPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['accepted', 'arrived', 'started', 'completed', 'cancelled'],
      default: 'accepted',
    },
    acceptedAt: { type: Date, default: Date.now },
    arrivedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
