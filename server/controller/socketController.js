const bcrypt = require("bcrypt");
let users = {};

module.exports.delete = (city, email, cities_data, socket) => {
  const { local_arr } = users[email.toLowerCase()];
  if (local_arr.includes(city)) {
    local_arr.splice(local_arr.indexOf(city), 1);
    let data = {};
    local_arr.map((city) => {
      data[city] = cities_data[city];
    });
    console.log(users[email.toLowerCase()].local_arr);
    socket.emit("data-client", data);
  }
};

module.exports.get_data_req = async (
  city,
  email,
  default_cities,
  cities_data,
  socket,
  get_data
) => {
  const { local_arr } = users[email];
  if (
    !local_arr.includes(city) &&
    !default_cities.includes(city) &&
    city != ""
  ) {
    try {
      default_cities.push(city);
      const res = await get_data(city, socket);
      res ? null : users[email.toLowerCase()].local_arr.push(city);
    } catch (e) {
      console.log(e);
    }
  }
  let data = {};
  local_arr.map((city) => {
    data[city] = cities_data[city];
  });
  console.log(users[email].local_arr);
  socket.emit("data-client", data);
};

module.exports.data_client = (cities_data, local_arr, local_data, socket) => {
  local_arr.forEach((city) => {
    local_data[city] = cities_data[city];
  });
  socket.emit("data-client", local_data);
};

module.exports.send_user = (data, local_arr, socket) => {
  const { name, email, password } = data.userData;
  // const user = new User({
  //   name,
  //   email,
  //   password: bcrypt.hashSync(password, 8),
  // });
  // user.save((err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     socket.emit("User_Registered", "User Succefully Registered");
  //   }
  // });
  users[email.toLowerCase()] = {
    name,
    password: bcrypt.hashSync(password, 8),
    local_arr,
  };
  console.log(users);
  socket.emit("User_Registered", "User Succefully Registered");
};

module.exports.login = (data, socket) => {
  const { email, password } = data.userData;

  if (email.toLowerCase() in users) {
    bcrypt.compareSync(password, users[email.toLowerCase()].password)
      ? socket.emit("succesfully logged in")
      : socket.emit("password not matched");
  } else {
    socket.emit("no user found");
  }
  // User.findOne({ email: email }, function (err, docs) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Result : ", docs);
  //     console.log(password);
  //     console.log(docs.password);
  //     if (bcrypt.compareSync(password, docs.password)) {
  //       console.log("login Successfully");
  //     } else {
  //       console.log("password not matched");
  //     }
  //   }
  // });
};

module.exports.my_data = (email, cities_data, socket) => {
  const { local_arr } = users[email.toLowerCase()];
  let data = {};
  local_arr.map((city) => {
    data[city] = cities_data[city];
  });
  socket.emit("data-client", data);
};
module.exports.disconnect = (socket) => {
  console.log(socket);
};
