const express = require('express');
const app = express();
const http = require('http');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./model/user');

const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors)
//server established
const server = http.createServer(app);
//port
const port = process.env.port || 3001;


//mongo db connection
const dbUrl = "mongodb+srv://root:1234@demo.opycalj.mongodb.net/weather?retryWrites=true&w=majority"
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        server.listen(port, () => console.log("app is listening", port))
    })
    .catch((err) => console.log(err));




const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["Get", "Post", "Put", "Delete"]
    }
})


io.on('connection', (socket) => {

    console.log(`User Connected : ${socket.id}`)
    socket.on("send_message", (data) => {
        const { name, email, password } = data.userData;
        const user = new User({
            name,
            email,
            password: bcrypt.hashSync(password, 8),
        })
        user.save(err => {
            if (err) {
                console.log(err);
            } else {
                socket.emit("User_Registered", "User Succefully Registered")
            }
        })


    })

    socket.on("login", (data) => {
        const { email, password } = data.userData;

        User.findOne({ email: email }, function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Result : ", docs);
                console.log(password)
                console.log(docs.password)
                if (bcrypt.compareSync(password, docs.password)) {
                    console.log("login Successfully");
                }
                else {
                    console.log("password not matched");
                }
            }
        });

    })


    console.log(`disconnect`, () => {
        console.log("User Disconnected");
    })

})










// io.on('connection', (socket) => {
//     console.log(`User Connected : ${socket.id}`)

//     socket.on("send_message", (data) => {
//         console.log(data);
//         socket.emit("receive_message", data)
//     })
// })


// server.listen(port, () => {
//     console.log("Server is Running", port)
// })





//fetching api
// const key = 'c6d329a1623d6328fc574f9728d994ee'
// let city = {
//     karachi: 'Karachi',
//     Lahore: 'Lahore',
//     Peshawar: 'Peshawar',
//     Quetta: 'Quetta',
//     Islamabad: 'Islamabad'
// }
// city = Object.assign(city, {
//     Hyderabad: 'Hyderabad'
// });
// for (let a in city) {
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city[a]},PK&appid=${key}`
//     fetch(apiUrl)
//         .then(function (resp) {
//             return resp.json()
//         }) // Convert data to json
//         .then(function (data) {
//             socket.emit("receive_message", data)
//         })
//         .catch(function (err) {
//             console.log(err);
//         });
// }
















// app.listen(9000,()=>{
//     console.log("app is listening");
// })