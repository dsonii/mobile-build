const admin = require("firebase-admin");
const { Setting } = require("../models");

let initializedApp = null;
const firebaseAdmin = async () => {
  try {
    const getSetting = await Setting.findOne({}, "notifications");
    if (
      getSetting &&
      getSetting.notifications.firebase_database_url &&
      getSetting.notifications.firebase_credential
    ) {
      const firebase_database_url =
        getSetting.notifications.firebase_database_url;
      const firebase_credential = getSetting.notifications.firebase_credential;
      const CERT = firebase_credential.private_key?.replace(
        /\\n/g,
       '\n',
      );
      firebase_credential.private_key = CERT;
      admin.initializeApp({
        credential: admin.credential.cert(firebase_credential),
        databaseURL: firebase_database_url,
      });
      initializedApp = admin;
  
    }
  } catch (err) {
    console.error("Error initializing Firebase:", err);
  }
};

firebaseAdmin();


const UserNotification = async (title, message, data, token) => {
  try {
    if (typeof data == "object") {
      var message = {
        data: {
          title: title,
          message: message,
          data: data,
        },
      };
    } else {
      var message = {
        data: {
          title: title,
          message: message,
        },
      };
    }

    return initializedApp.messaging().sendToDevice(token, message);
  } catch (err) {
    console.log("err", err);
  }
};


module.exports = {
  UserNotification,
};
