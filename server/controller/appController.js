const dotenv = require("dotenv").config();
const axios = require("axios");
const masterCities_data = require("../model/defaultCitiesData");

const default_cities = ["karachi", "lahore", "islamabad", "peshawar", "gwadar"];
const cities_data = {};

const get_data = async (city, socket = {}) => {
  if (typeof city === "string") {
    try {
      const address = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`;
      console.log(address);
      const data = await axios.get(address);
      cities_data[city] = data.data;
      await masterCities_data.findOneAndUpdate(
        { name: city },
        {
          name: city,
          data: data.data,
        },
        {
          upsert: true,
          new: true,
        }
      );
    } catch (e) {
      console.log(e);
      socket === {} ? console.log("error") : socket.emit("error", {});
      return e;
    }
  }
};
masterCities_data.find({}, (err, docs) => {
  docs.map((doc) => {
    cities_data[doc.name] = doc.data;
  });
});
module.exports.get_data = get_data;
module.exports.default_cities = default_cities;
module.exports.cities_data = cities_data;
