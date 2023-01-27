const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  local_arr: {
    required: true,
    type: [String],
    default: ["karachi", "lahore", "islamabad", "peshawar", "gwadar"],
  },
});

const users = mongoose.model("users", userSchema);

module.exports = users;
