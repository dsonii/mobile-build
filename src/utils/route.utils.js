const {
  Setting,
  Wallet,
  Location,
  Route,
  RouteDetail,
  User,
  SearchAddress,
  Booking,
} = require("../models");
const { HelperTimeZone } = require("../helpers");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId, ISODate } = Schema;
const moment = require("moment-timezone");

module.exports = {
  findRouteMatched: async (
    currentDate,
    pickup_long,
    pickup_lat,
    drop_long,
    drop_lat
  ) => {
    try {
      const start_point = await Location.findByCoordinates(
        pickup_long,
        pickup_lat
      );
      const end_point = await Location.findByCoordinates(drop_long, drop_lat);

      const getRouteDetail = await RouteDetail.find({
        locationId: { $in: [start_point._id, end_point._id] },
      }).lean();
      return getRouteDetail;
      //  return getRouteDetail.length > 0 ? getRouteDetail : 0;
    } catch (err) {
      return 0;
    }
  },
  findRouteNearBy: async (from, to) => {
    try {
      var location1 = await Location.nearBy(loc1.location.coordinates, 5); // near 5 km fetch data
      var location2 = await Location.nearBy(loc2.location.coordinates, 5); // near 5 km fetch data
    } catch (err) {
      res.status(401).json({
        status: false,
        message: "Location not found",
        errorMessage: err.message,
      });
    }
  },
  checkSeatAvailablity: async (
    busscheduleId,
    busId,
    seat_numbers,
    data,
    currentDate,
    endDate
  ) => {
    var selectableItems = [];
    var dataItems = [];
    var seat_status = "";
    const seatExists = await Booking.bookingExists(
      busscheduleId,
      busId,
      seat_numbers,
      currentDate,
      endDate
    );

    console.log("seatExists",seatExists);
    console.log("seatExists",data);

    const left_1 = data[0];
    const left_2 = data[1];
    const left_3 = data[2];
    const right_1 = data[3];
    const right_2 = data[4];
    const right_3 = data[5];

    left_1.map((d) => {
      var seat_status =
        seatExists.length > 0 && seatExists[0]?.includes(d.seat_no)
          ? "booked"
          : "empty";
      d.seat_status = seat_status;
      Object.assign(d, {is_female:""});
      if (seatExists.length > 0 && typeof seatExists[1] != 'undefined') {
        let isFemale = "";
        for (i = 0; i < seatExists[1].length; i++) { 
          if (seatExists[1][i].key === d.seat_no) {
            isFemale = seatExists[1][i].value;
          }
        }
        d.is_female = isFemale;
      }
    });

    left_2.map((d) => {
      var seat_status =
        seatExists.length > 0 && seatExists[0].includes(d.seat_no)
          ? "booked"
          : "empty";
      d.seat_status = seat_status;
      Object.assign(d, {is_female:""});
      if (seatExists.length > 0 && typeof seatExists[1] != 'undefined') {
        let isFemale = "";
        for (i = 0; i < seatExists[1].length; i++) { 
          if (seatExists[1][i].key === d.seat_no) {
            isFemale = seatExists[1][i].value;
          }
        }
        d.is_female = isFemale;
      }
    });
    left_3.map((d) => {
      var seat_status =
        seatExists.length > 0 && seatExists[0].includes(d.seat_no)
          ? "booked"
          : "empty";
      d.seat_status = seat_status;
      Object.assign(d, {is_female:""});
      if (seatExists.length > 0 && typeof seatExists[1] != 'undefined') {
        let isFemale = "";
        for (i = 0; i < seatExists[1].length; i++) { 
          if (seatExists[1][i].key === d.seat_no) {
            isFemale = seatExists[1][i].value;
          }
        }
        d.is_female = isFemale;
      }
    });
    right_1.map((d) => {
      var seat_status =
        seatExists.length > 0 && seatExists[0].includes(d.seat_no)
          ? "booked"
          : "empty";
      d.seat_status = seat_status;
      Object.assign(d, {is_female:""});
      if (seatExists.length > 0 && typeof seatExists[1] != 'undefined') {
        let isFemale = "";
        for (i = 0; i < seatExists[1].length; i++) { 
          if (seatExists[1][i].key === d.seat_no) {
            isFemale = seatExists[1][i].value;
          }
        }
        d.is_female = isFemale;
      }
    });
    right_2.map((d) => {
      var seat_status =
        seatExists.length > 0 && seatExists[0].includes(d.seat_no)
          ? "booked"
          : "empty";
      d.seat_status = seat_status;
      Object.assign(d, {is_female:""});
      if (seatExists.length > 0 && typeof seatExists[1] != 'undefined') {
        let isFemale = "";
        for (i = 0; i < seatExists[1].length; i++) { 
          if (seatExists[1][i].key === d.seat_no) {
            isFemale = seatExists[1][i].value;
          }
        }
        d.is_female = isFemale;
      }
    });
    right_3.map((d) => {
      var seat_status =
        seatExists.length > 0 && seatExists[0].includes(d.seat_no)
          ? "booked"
          : "empty";
      d.seat_status = seat_status;
      Object.assign(d, {is_female:""});
      if (seatExists.length > 0 && typeof seatExists[1] != 'undefined') {
        let isFemale = "";
        for (i = 0; i < seatExists[1].length; i++) { 
          if (seatExists[1][i].key === d.seat_no) {
            isFemale = seatExists[1][i].value;
          }
        }
        d.is_female = isFemale;
      }
    });

    return [left_1, left_2, left_3, right_1, right_2, right_3];
  },
};
