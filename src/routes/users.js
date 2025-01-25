const express = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/users/profiles/');
    },
    filename: function(re, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Wrong file type'), false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

const { authenticate } = require('../middleware/authenticate');
const { csrfCheck } = require('../middleware/csrfCheck');
const { initSession, isEmail } = require('../utils/utils');


const userController = require("../controllers/users/index.controller");
const notificationController = require("../controllers/users/notification.controller");
const UserModel = require('../models/User.model');
const router = express.Router();

router.post('/register', userController.register);


router.post('/refresh-token',userController.refresh);


router.post('/help', authenticate, userController.help);

router.post('/verify', authenticate, userController.verifyOTP);

router.post('/re-send', authenticate, userController.reSendOTP);

router.get('/refercode', authenticate, userController.referral);

router.post('/addmoney', authenticate, userController.addmoney);

router.post('/payment/verify', authenticate, userController.verifypayment);

router.post('/referrallink/:referral', authenticate, userController.referrallink);

router.get('/walletcheck', authenticate, userController.walletcheck);

router.get('/wallet-transactions',authenticate, userController.wallettransactions);

router.get('/booking-transactions',authenticate, userController.bookingTransactions);
router.get('/default-booking',authenticate, userController.defaultBooking);

router.post('/updateuser', authenticate, upload.single('ProfilePic'),userController.updateuser);

router.post("/update-language", authenticate, userController.updateLang);


router.post('/booking', userController.book);

router.get('/me', authenticate, userController.findProfile);

router.delete('/me', authenticate, csrfCheck, userController.userDelete);

router.post('/searchlocation', authenticate,  userController.searchlocation);

router.put('/logout', authenticate, csrfCheck, userController.logout);

router.post('/my-trips', authenticate, userController.getTrips)

router.post('/trip-qr', authenticate, userController.generateQRTrip)


router.post('/add-update-office-and-home', authenticate, userController.addHomeOffice)


router.post('/trip-track', authenticate, userController.track)

router.get('/invoice/:pnr_no', userController.invoiceGenerate)


/**** notifications***/

router.get("/notification/lists", authenticate, notificationController.lists);
router.get(
  "/notification/clear-all",
  authenticate,
  notificationController.clearAll
);



module.exports = router;