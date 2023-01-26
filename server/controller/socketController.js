const bcrypt = require("bcrypt");
const users_db = require("../model/userModel");

module.exports.delete = async (city, email, cities_data, socket) => {
  await users_db.updateOne(
    { email: email.toLowerCase() },
    { $pull: { local_arr: city } }
  );

  users_db.findOne({ email: email.toLowerCase() }, (err, doc) => {
    let data = {};
    doc.local_arr.map((city) => {
      data[city] = cities_data[city];
    });
    socket.emit("data-client", data);
  });

  // const { local_arr } = users[email.toLowerCase()];
  // if (local_arr.includes(city)) {
  //   local_arr.splice(local_arr.indexOf(city), 1);
  //   let data = {};
  //   local_arr.map((city) => {
  //     data[city] = cities_data[city];
  //   });
  //   console.log(users[email.toLowerCase()].local_arr);
  //   socket.emit("data-client", data);
  // }
};

module.exports.get_data_req = async (
  city,
  email,
  // default_cities,
  cities_data,
  socket,
  get_data
) => {
  let user = await users_db.find({ email });
  if (
    !user[0].local_arr.includes(city) &&
    !(city in cities_data) &&
    city != ""
  ) {
    try {
      const res = await get_data(city, socket);
      res
        ? null
        : await users_db.updateOne(
            { email: email.toLowerCase() },
            { $push: { local_arr: city } }
          );
    } catch (e) {
      console.log(e);
    }
  }
  users_db.findOne({ email: email.toLowerCase() }, (err, doc) => {
    let data = {};
    doc.local_arr.map((city) => {
      data[city] = cities_data[city];
    });
    socket.emit("data-client", data);
  });
};

module.exports.data_client = (cities_data, local_arr, local_data, socket) => {
  local_arr.forEach((city) => {
    local_data[city] = cities_data[city];
  });
  socket.emit("data-client", local_data);
};

module.exports.send_user = (data, local_arr, socket) => {
  let { name, email, password } = data.userData;
  password = bcrypt.hashSync(password, 8);
  users_db.create(
    {
      name,
      email: email.toLowerCase(),
      password,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("user registred");
        socket.emit("User_Registered", "User Succefully Registered");
      }
    }
  );
};

module.exports.login = (data, socket) => {
  const { email, password } = data.userData;
  console.log(password, email);
  users_db.findOne({ email: email.toLowerCase() }, function (err, docs) {
    if (err) {
      console.log(err);
      socket.emit("no user found");
    } else {
      if (docs !== null) {
        if (bcrypt.compareSync(password, docs.password)) {
          console.log("login Successfully");
          socket.emit("succesfully logged in");
        } else {
          console.log("password not matched");
          socket.emit("password not matched");
        }
      } else {
        console.log("wrong email");
      }
    }
  });
};

module.exports.data_client_auth = (cities_data, email, socket) => {
  users_db.findOne({ email: email.toLowerCase() }, (err, doc) => {
    let data = {};
    doc.local_arr.map((city) => {
      data[city] = cities_data[city];
    });
    socket.emit("data-client", data);
  });
};

module.exports.my_data = (email, cities_data, socket) => {
  users_db.findOne({ email: email.toLowerCase() }, (err, doc) => {
    let data = {};
    doc.local_arr.map((city) => {
      data[city] = cities_data[city];
    });
    socket.emit("data-client", data);
  });
};
module.exports.disconnect = (socket) => {
  console.log(socket);
};
