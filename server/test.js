const mongoose = require("mongoose");
const users = require("./model/userModel");

const uri = "mongodb://localhost:27017/weather-app";

mongoose.connect(uri, (err) => {
  if (err) throw err;
});
users.find({}, (e, docs) => {
  console.log(docs);
});
