const Utils = require("../../utils/utils");
const routeUtils = require("../../utils/route.utils");
const {
    SearchAddress,
    Setting,
    Location,
    Route,
    RouteStop,
    RouteDetail,
    Bus,
    BusLayout,
    UserReferral,
	Wallet,
    Booking
} = require("../../models");
const mongoose = require("mongoose");
const _ = require("lodash");
const objectIdToTimestamp = require("objectid-to-timestamp");
const moment = require("moment-timezone");
const {
    HelperCustom
} = require('../../helpers')

    module.exports = {
    searchseats: async(req, res) => {
        try {
            const {
				busschedule_id,
                route_id,
                pickup_stop_id,
                drop_stop_id,
                type,
                has_return,
                 current_date,
                end_date,
            } = req.body;

            const busId = req.params.busId;
			const {
                walletId,
                userId
            } = req.session;
			
            const getbus = await Bus.findOne({
                _id: busId
            })
                .populate({
                path: "bustypeId",
                select: "name"
            })
                .populate({
                path: "buslayoutId",
                model: BusLayout
            })
                // .lean();
                const getbuses = await Bus.transformdata(getbus);
                let getBookedSeatsNew ="";
                let trimseat_nos ="";
                if (getbuses.buslayoutId.combine_seats.length > 0) {
                    let busNo = getbuses.buslayoutId.seat_numbers;
                    
                    trimseat_nos = busNo.split(",").map(function (item) { return item.trim() });
                    getBookedSeatsNew = await Booking.find({
                                busId:mongoose.Types.ObjectId(busId), 
                                seat_nos: { $in: trimseat_nos },
                                bus_depature_date: {$gte: moment().tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD')},
                                bookedBy: "admin",
                                travel_status: "PROCESSING",
                                is_deleted: false,
                                scheduleId : busschedule_id,
                            });
                   
                }


            const getFare = await HelperCustom.generateBookingFare(busschedule_id,route_id, busId, pickup_stop_id, drop_stop_id, "[A1]",has_return,current_date); // helper generate fare

	         getbuses.final_total_fare = getFare.final_total_fare;
            getbuses.tax = getFare.tax;
              getbuses.tax_amount = getFare.tax_amount;

            if (type === 'office') {
                getbuses.buslayoutId = await BusLayout.transformData(busschedule_id, busId, getbuses.buslayoutId,current_date,end_date);
                const getPassFare = await HelperCustom.generatePassFare(busschedule_id,route_id,pickup_stop_id, drop_stop_id, "[A1]",has_return); // helper generate fare

                getbuses.final_pass_fare = getPassFare;
                getbuses.pickup_name = getFare.pickup_name;
                getbuses.pickup_time = getFare.pickup_time;
                getbuses.drop_name = getFare.drop_name;
                getbuses.drop_time = getFare.drop_time;
                getbuses.seat_no = getFare.seat_no;
                getbuses.created_date = getFare.created_date;
            }else{

                 getbuses.buslayoutId = await BusLayout.transformData(busschedule_id, busId, getbuses.buslayoutId,current_date,'');
            }

			const wallet = await Wallet.findById({
                _id: walletId
            });
			 const credamount = await UserReferral.totalRefAmount(userId);
			getbuses.user_total_wallet_amount =  parseInt(wallet.amount);

            
            let removeSeats = [];
            if (getBookedSeatsNew) {
                for (dseatss of getBookedSeatsNew) { 
                    let moomentObj = moment(dseatss.start_time, ["h:mm A"]).format("HH:mm");
                    let splitTime = moomentObj.split(":");
                    let currentTime = moment().tz(DEFAULT_TIMEZONE).format('HH:mm');
        
                    let finalTine = splitTime[0]-1 +":"+ splitTime[1];
                    if (currentTime < finalTine) {
                        let currentAssignedSeatss = dseatss.seat_nos.toString();
                        if (trimseat_nos.includes(currentAssignedSeatss)){
                            trimseat_nos.splice(trimseat_nos.indexOf(currentAssignedSeatss), 1); 
                            removeSeats.push(currentAssignedSeatss);
                        }
                    }
                }
            }
			
            if (removeSeats.length > 0){
                for (removeSeat of removeSeats) { 
                    if (getbuses.buslayoutId.combine_seats.length > 0) {
                        let combineSeats = getbuses.buslayoutId.combine_seats;
                        for (const [combineSeatKey, combineSeat] of Object.entries(combineSeats)) { 
                            for(const [rowKey, row] of Object.entries(combineSeat)) {
                                if (removeSeat == row.seat_no) {
                                    getbuses.buslayoutId.combine_seats[combineSeatKey].splice(rowKey,1);
                                }
                            }
                        }
                    }
                }
            }

            res.status(200).json({
                status: true,
                message: "Successfully found bus seats ",
                data: getbuses
            });

        } catch (err) {
            console.log(err);
            res.status(200).json({
                status: false,
                message: "bus seat not found",
                errorMessage: err.message,
            });
        }
    },
};
