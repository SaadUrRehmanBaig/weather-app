const dotenv = require("dotenv").config();
const axios = require("axios");

const default_cities = ["karachi", "lahore", "islamabad", "peshawar", "gwadar"];
const cities_data = {};
const get_data = async (city, socket = {}) => {
  if (typeof city === "string") {
    try {
      const address = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`;
      const data = await axios.get(address);
      cities_data[city] = data.data;
    } catch (e) {
      console.log(socket);
      socket === {} ? console.log("error") : socket.emit("error", {});
      return e;
    }
  }
};

module.exports.get_data = get_data;
module.exports.default_cities = default_cities;
module.exports.cities_data = cities_data;
