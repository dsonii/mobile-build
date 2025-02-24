const mongoose = require("mongoose");
const fs = require('fs')
const secrets = {
  dbUri: dbUri: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?authSource=admin`,
  dbUriLocal: process.env.MONGO_DB_LOCAL
 };

const getSecret = (key) => secrets[key];

mongoose.Promise = global.Promise;
const env = process.env.NODE_ENV;
// print mongoose logs in dev env
if (env === "development") {
  mongoose.set("debug", true);
}

mongoose.set("strictQuery", true);
/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose
    .connect(secrets.dbUri, {
      keepAlive: true,
    })
    .then(() => console.log("mongoDB connected..."));
  return mongoose.connection;
};
