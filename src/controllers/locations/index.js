const { SearchAddress, Location, CurrentLocation } = require("../../models");
const mongoose = require("mongoose");

module.exports = {
  savelocation: async (req, res) => {
    try {
      const { search_name } = req.body;
      const arrplaceID = [];
      if (typeof search_name == "object") {
        for (var value of search_name) {
          arrplaceID.push(value.placeId);
        }

        const newAddress = await SearchAddress.insertMany(search_name);
        res.status(200).json({
          message: "address save Successfully",
          status: true,
        });
      }
    } catch (err) {
      res.status(200).json({
        message: "err while :" + err,
        status: false,
      });
    }
  },
  findSearchAddress:async (req,res,next) => {
    try {
    var searchname = {
       name: { $regex: '(\s+'+req.body.address+'|^'+req.body.address+')',  $options: "i"}, 
        
    };
    
      const searchdata =  await SearchAddress.aggregate([
        { $match :searchname },
        { $group : { _id : "$lat",id:{ $first: '$_id' },placeId : { $first: '$placeId' }, name : { $first: '$name' }, sub_name : { $first: '$sub_name' }, lat : { $first: '$lat' }, lng : { $first: '$lng' },city : { $first: '$city' },state : { $first: '$state' }  } },
        {$limit:parseInt(req.body.limit)}
      ])

          if(searchdata.length > 0){

          res.status(200).json({
          message:"address list",
          data:SearchAddress.transformData(searchdata),
          total_count:searchdata.length,
          status:true
      })
              
          }else{

          res.status(200).json({
          message:"no record found.",
          status:false
      })
              
          }
    
  }catch(err){

        res.status(200).json({
            message:"err while :"+err ,
            status:false
        })

    }

  },
  searchlocation: async (req, res) => {
    try {
      const address = req.body.address;
      var searchname = {
        title: {
          $regex: "(s+" + address + "|^" + address + ")",
          $options: "i",
        },
        status:true
      };

      var location = await Location.aggregate([
        {
          $match: searchname,
        },
        {
          $group: {
            _id: "$_id",
            id: {
              $first: "$_id",
            },
            title: { $first: "$title" },
            location: {
              $first: "$location",
            },
            type: {
              $first: "$type",
            },
            city: {
              $first: "$city",
            },
            state: {
              $first: "$state",
            },
          },
        },
        {
          $limit: parseInt(req.body.limit),
        },
      ]);

      if (location.length > 0) {
        res.status(200).json({
          status: true,
          message: "Successfully found location",
          data: Location.transformData(location),
          total_count:location.length,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "location not found",
        });
      }
    } catch (err) {
      res.status(401).json({
        status: false,
        message: "Location not found",
        errorMessage: err.message,
      });
    }
  },
   saveBookingLocation: async (req, res) => {
    const {bookingId, lng, lat } = req.body;
    var locationExist = await CurrentLocation.findOne({bookingId:mongoose.Types.ObjectId(bookingId)});
    let saveLocation = {};
    if (!locationExist) {
      saveLocation = new CurrentLocation({
        bookingId: mongoose.Types.ObjectId(bookingId),
        current_location: [parseFloat(lng), parseFloat(lat)],
        old_location: [],
      });
      const currentLocation = await saveLocation.save();
      res.status(200).json({
        status: true,
        message: "saved Current Location",
      });
      
    } else {
      saveLocation = {
        current_location: [parseFloat(lng), parseFloat(lat)],
        old_location: locationExist.current_location,
      };
      await CurrentLocation.updateOne(
        {_id: mongoose.Types.ObjectId(locationExist._id) },
        saveLocation
      );
      res.status(200).json({
        status: true,
        message: "saved Current Location",
      });
    }
  },
};
