const mongoose = require("mongoose");
const moment = require("moment-timezone");

/**
 * Bus type Schema
 * @private
 */
const ChatSchema = new mongoose.Schema (
  {
    bookingId: { type: Object, ref: 'Booking', required: true },
    userId: { type: Object, ref: 'User', required: true },
    driverId: { type: Object, ref: 'Driver', required: true },
    sentBy: { type: String, default: "" },
    amount: { type: String, default:"" },
    message: { type: String, default:"" },
    isFinalPrice: { type: Boolean, default: true },
    chatType: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

ChatSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'bookingId','userId', 'driverId', 'sentBy', , 'amount', 'message', 'isFinalPrice', 'chatType'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
});


ChatSchema.statics = {
  transformData: (data) => {
    const selectableItems = [];
    let i = 1;
    data.forEach((item) => {
      selectableItems.push({
        id:i++,
        ids: item.id,
        bookingId: item.bookingId,
        userId: item.userId,
        driverId: item.driverId,
        userId: item.userId,
        sentBy: item.sentBy,
        amount: item.amount,
        message: item.message,
        isFinalPrice: item.isFinalPrice,
        chatType: item.chatType,
        createdAt: moment.utc(item.createdAt).tz("Asia/Kolkata").format("DD MMM YYYY"),
      });
    });
    return selectableItems;
  },
};

module.exports = mongoose.model("Chat", ChatSchema);
