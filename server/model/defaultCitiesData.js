const mongoose = require("mongoose");

const defaulttCitiesData_schema = new mongoose.Schema({
  city_name: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const default_cities_data = mongoose.model("city", defaulttCitiesData_schema);

module.exports = default_cities_data;
