const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIo = require("socket.io")
const dotenv = require('dotenv').config()
const axios = require('axios')


const app = express()
app.use(cors())

const default_cities = ['karachi', 'lahore', 'islamabad', 'peshawar', 'gwadar'];
const cities_data = {}

async function get_data(city,socket={}) {
    if (typeof (city) === 'string') {
        try {
            const address = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`;
            const data = await axios.get(address)
            cities_data[city] = (data.data)
        }catch(e){
            socket.emit('error',{})
            console.log(e)
        }
    }
}

default_cities.map((city) => { get_data(city) })

setInterval(async () => {
    await default_cities.map((city) => { get_data(city) });
    io.local.emit('data updated')
}, 600000)


const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {

    let start = 0;
    let end = 5;
    let local_arr = [...default_cities.slice(start, end)]
    let local_data = {}

    local_arr.forEach((city) => {
        local_data[city] = cities_data[city]
    })

    console.log("connection established", socket.id)
    /* associate user id from socket id here*/

    socket.emit('data-client', local_data)

    socket.on('data-client', () => {
        local_arr.forEach((city) => {
            local_data[city] = cities_data[city]
        })
        socket.emit('data-client', local_data)
    })

    socket.on('get_data_req', async (city) => {

        if (!local_arr.includes(city) && !default_cities.includes(city)) {
            local_arr.push(city)
            default_cities.push(city)
            await get_data(city,socket)
        }
        local_data[city] = cities_data[city]
        socket.emit('send-data-client', local_data)
    })

    socket.on('delete',(data)=>{
        if (data in local_data){
            delete local_data[data]
            local_arr.splice(local_arr.indexOf(data),1)
            socket.emit('send-data-client', local_data)
        }
    })

})

server.listen(3001, () => {
    console.log('server running on port 3001')
})

