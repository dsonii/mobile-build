const {
  Booking,
  Chat,
  User,
  Driver,
} = require("../../models");
const _ = require("lodash");
const objectIdToTimestamp = require("objectid-to-timestamp");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Types = mongoose.Types

module.exports = {
    create: async (req, res) => {
    try {
        const { bookingId, userId, driverId, sentBy, amount, message, isFinalPrice, chatType } = req.body;
        const driverExist = await Driver.findOne({_id: Types.ObjectId(driverId)});
        const userExist = await User.findOne({_id: Types.ObjectId(userId)});
        const booking = await Booking.findOne({_id: Types.ObjectId(bookingId)});
        if (!driverExist) {
            res.status(200).json({
              title:
                "Driver not found. Please contact support to add your information.",
                data:"",
              status: false,
              message: "Driver not found",
            });
        } else if (!userExist) {
            res.status(200).json({
                title: "User not found. Please contact support to add your information.",
                data:"",
                status: false,
                message: "User not found",
              });
        } else if (!booking) {
            res.status(200).json({
                title:
                  "Booking not found. Please contact support to add your information.",
                  data:"",
                status: false,
                message: "Booking not found",
              });
        } else {
            const chechat = await Chat.findOne({bookingId: Types.ObjectId(bookingId), 'isFinalPrice':true});
            const chat = new Chat({ bookingId:Types.ObjectId(bookingId), userId:Types.ObjectId(userId), driverId:Types.ObjectId(driverId), sentBy, amount, message, isFinalPrice, chatType });
            const persistedChat = await chat.save();
            
            if (isFinalPrice == 'true') {
                if (!chechat) {
                    const updateBooking = await Booking.updateOne(
                        {_id: Types.ObjectId(bookingId)},
                        {
                            final_total_fare: amount,
                            old_fare: booking.final_total_fare,
                        }
                      );
                } else {
                    const updateChat = await Chat.updateOne(
                        {_id: Types.ObjectId(persistedChat._id)},
                        {
                            isFinalPrice: false
                        }
                      );
                      res.status(200).json({
                        title:"",
                        data:persistedChat,
                        status: false,
                        message: "Final price has already been accepted",
                      });
                }
            }
            res.status(200).json({
                title:"",
                data:persistedChat,
                status: true,
                message: "chat added successfully",
              });
        }
    } catch (err) {
      throw err;
    }
  },
  get: async (req, res) => {
    const { bookingId, userId, driverId, chatType, sentBy} = req.body;
    mongoose.set('debug',true);
    let chat ="";
    if (bookingId != "" && userId == "" && driverId == "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), chatType: chatType, sentBy:sentBy});
    } else if (bookingId != "" && userId != "" && driverId == "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), userId: Types.ObjectId(userId), chatType: chatType, sentBy:sentBy});
    } else if (bookingId != "" && userId == "" && driverId != "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), driverId: Types.ObjectId(driverId), chatType: chatType, sentBy:sentBy});
    } else if (bookingId != "" && userId != "" && driverId != "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), userId: Types.ObjectId(userId), driverId: Types.ObjectId(driverId), chatType: chatType});
    }
    if (chat) {
        res.status(200).json({
            data:chat,
            status: true,
            message: "chat fetched successfully",
        });
    } else {
        res.status(200).json({
            data:[],
            status: false,
            message: "chat fetched successfully",
        });
    }
  }
};
