const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv").config();
const axios = require("axios");
const socketController = require("./controller/socketController");

const app = express();
app.use(cors());

const default_cities = ["karachi", "lahore", "islamabad", "peshawar", "gwadar"];
const cities_data = {};

async function get_data(city, socket = {}) {
  if (typeof city === "string") {
    try {
      const address = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`;
      const data = await axios.get(address);
      cities_data[city] = data.data;
    } catch (e) {
      socket.emit("error", {});
      console.log(e);
    }
  }
}

default_cities.map((city) => {
  get_data(city);
});

setInterval(async () => {
  await default_cities.map((city) => {
    get_data(city);
  });
  io.local.emit("data updated");
}, 600000);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  let local_arr = [...default_cities.slice(0, 5)];
  let local_data = {};

  local_arr.forEach((city) => {
    local_data[city] = cities_data[city];
  });

  console.log("connection established", socket.id);
  /* associate user id from socket id here*/

  socket.emit("data-client", local_data);

  socket.on("data-client", () =>
    socketController.data_client(cities_data, local_arr, local_data, socket)
  );

  socket.on("get_data_req", (city) => {
    socketController.get_data_req(
      city,
      default_cities,
      cities_data,
      local_arr,
      local_data,
      socket,
      get_data
    );
  });

  socket.on("delete", (data) =>
    socketController.delete(data, local_arr, local_data, socket)
  );

  socket.on("send_user", (data) => {
    socketController.send_user(data, socket);
  });

  socket.on("login", (data) => socketController.login(data, socket));
  socket.on("disconnect", (socket) => {
    socketController.disconnect(socket);
    /* associate user id from socket id here*/
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
