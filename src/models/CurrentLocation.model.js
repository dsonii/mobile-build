const mongoose = require("mongoose");
const moment = require("moment-timezone");


const CurrentLocationSchema = new mongoose.Schema(
  {
    bookingId: { type: Object, ref: 'Booking', required: true },
    old_location: [Number],
    current_location: [Number],
  },
  { timestamps: true }
);


CurrentLocationSchema.statics = {}

module.exports = mongoose.model("CurrentLocation", CurrentLocationSchema);
