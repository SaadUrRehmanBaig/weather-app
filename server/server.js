const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/weather-app";

mongoose.connect(uri, (err) => {
  if (err) throw err;
  else {
    const express = require("express");
    const cors = require("cors");
    const http = require("http");
    const socketIo = require("socket.io");
    const socketController = require("./controller/socketController");
    const {
      get_data,
      default_cities,
      cities_data,
    } = require("./controller/appController");
    const masterCities_data = require("./model/defaultCitiesData");

    const app = express();
    app.use(cors());

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

      socket.on("my-data", (email) => {
        socketController.my_data(email, cities_data, socket);
      });
      socket.emit("data-client", local_data);

      socket.on("data-client", () =>
        socketController.data_client(cities_data, local_arr, local_data, socket)
      );

      socket.on("data-client-authenticated-user", (email) =>
        socketController.data_client_auth(cities_data, email, socket)
      );

      socket.on("get_data_req", ({ city, email }) => {
        socketController.get_data_req(
          city,
          email,
          // default_cities,
          cities_data,
          socket,
          get_data
        );
      });

      socket.on("delete", (data, email) => {
        socketController.delete(data, email, cities_data, socket);
      });

      socket.on("send_user", (data) => {
        socketController.send_user(data, local_arr, socket);
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
  }
});
