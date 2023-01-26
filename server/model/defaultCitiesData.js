const mongoose = require("mongoose");

const defaulttCitiesData_schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  data: {
    required: true,
    type: mongoose.Schema.Types.Mixed,
  },
});

const default_cities_data = mongoose.model("city", defaulttCitiesData_schema);

module.exports = default_cities_data;
