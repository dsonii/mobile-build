const express = require('express');
const bcrypt = require('bcryptjs');

const { authenticate } = require('../middleware/authenticate');
const { csrfCheck } = require('../middleware/csrfCheck');
const { initSession, isEmail } = require('../utils/utils');

const driverController = require('../controllers/driver.controller');
const driverassignController = require('../controllers/driverassign.controller');


const router = express.Router();

router.post('/login', driverController.login);

router.post('/refresh-token', driverController.refresh);

router.post('/verify', authenticate, driverController.verifyOTP);

router.post('/re-send', authenticate, driverController.reSendOTP);

router.post('/update-location',authenticate, driverController.updateLocation);


router.get('/getdriver', authenticate, driverController.getDriver);

router.post('/updatedriver', authenticate, driverController.updateDriver);

router.post('/update-language', authenticate, driverController.updateLang);


router.post('/passengerlist', driverController.passengerList)
router.post('/passenger-details', driverController.passengerDetails)

router.put('/logout', authenticate, csrfCheck, driverController.logout);


router.get('/notifications', authenticate, driverController.notification);

router.post('/notifications/:notifyId/:read', authenticate, driverController.updateNotification);


router.get('/my-trips',authenticate, driverassignController.myTrips);

router.post('/get-stop-details',authenticate, driverassignController.getStopDetails);

router.post('/update-booking-status',authenticate, driverassignController.updateBookingStatus);

router.post('/update-assign-status/:assignId', authenticate, driverassignController.updateAssign);

router.post('/get-route-data',authenticate, driverassignController.getRouteData);


module.exports = router;