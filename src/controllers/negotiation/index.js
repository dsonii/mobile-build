const {
  BookingAssign,
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
        let { bookingId, sentBy, amount, message, isFinalPrice, chatType } = req.body;
        let booking = await Booking.findOne({_id: Types.ObjectId(bookingId)});
        
        if (booking == "" || booking.length <= 0) {
            res.status(200).json({
                title:
                  "Booking not found. Please contact support to add your information.",
                  data:"",
                status: false,
                message: "Booking not found",
              });
        } else {
            let busscheduleId = booking.busscheduleId;
            let userId = booking.userId;
            let getDriver = await BookingAssign.findOne({busScheduleId: Types.ObjectId(busscheduleId)});
            if (getDriver == "" || getDriver.length <= 0) {
              res.status(200).json({
                title:"",
                data:persistedChat,
                status: false,
                message: "Driver Id not Found",
              });
            }
            let driverId = getDriver.driverId;
            const chechat = await Chat.findOne({bookingId: Types.ObjectId(bookingId), 'isFinalPrice':true});
            let chat = new Chat({ bookingId:Types.ObjectId(bookingId), userId:Types.ObjectId(userId), driverId:Types.ObjectId(driverId), sentBy, amount, message, isFinalPrice, chatType });
            
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
  getChat: async (req, res) => {
    const { bookingId, userId, driverId, chatType, sentBy} = req.body;
   
    let chat ="";
    if (bookingId != "" && userId == "" && driverId == "") {
      if (sentBy == "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), chatType: chatType}).populate(['userId', 'driverId']).lean();
      } else {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), chatType: chatType, sentBy:sentBy});
      }
    } else if (bookingId != "" && userId != "" && driverId == "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), userId: Types.ObjectId(userId), chatType: chatType, sentBy:sentBy});
    } else if (bookingId != "" && userId == "" && driverId != "") {
        chat = await Chat.find({bookingId: Types.ObjectId(bookingId), driverId: Types.ObjectId(driverId), chatType: chatType, sentBy:sentBy});
    } else if (bookingId != "" && userId != "" && driverId != "") {
      chat = await Chat.find({bookingId: Types.ObjectId(bookingId), userId: Types.ObjectId(userId), driverId: Types.ObjectId(driverId), chatType: chatType});
    } else if (bookingId == "" && userId == "" && driverId != "") {
      chat = await Chat.aggregate([{$lookup:{from:'users', localField:'userId', foreignField:'_id', as:'User'}},{$lookup:{from:'drivers', localField:'driverId', foreignField:'_id', as:'Driver'}},{ $group: { _id:"$bookingId", detail: { $first: '$$ROOT' }}}, {$project:{_id:"$detail._id", bookingId: "$detail.bookingId", userId: "$detail.User",driverId: "$detail.Driver", "sentBy":"$detail.sentBy","amount":"$detail.amount","message":"$detail.message","isFinalPrice":"$detail.isFinalPrice","chatType":"$detail.chatType", createdAt:"$detail.createdAt",updatedAt:"$detail.updatedAt"}}]);
    } else if (bookingId == "" && userId != "" && driverId == "") {
      chat = await Chat.find({userId: Types.ObjectId(userId), chatType: chatType});
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
