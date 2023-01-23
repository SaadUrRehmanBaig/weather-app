const bcrypt = require("bcrypt");
let users = {};

module.exports.delete = (data, local_arr, local_data, socket) => {
  if (data in local_data) {
    delete local_data[data];
    local_arr.splice(local_arr.indexOf(data), 1);
    socket.emit("send-data-client", local_data);
  }
};

module.exports.get_data_req = async (
  city,
  default_cities,
  cities_data,
  local_arr,
  local_data,
  socket,
  get_data
) => {
  if (
    !local_arr.includes(city) &&
    !default_cities.includes(city) &&
    city != ""
  ) {
    local_arr.push(city);
    default_cities.push(city);
    await get_data(city, socket);
  }
  local_data[city] = cities_data[city];
  socket.emit("send-data-client", local_data);
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
  console.log("email", email);
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
