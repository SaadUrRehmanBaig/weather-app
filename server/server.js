const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIo = require("socket.io")
const dotenv = require('dotenv').config()
const axios = require('axios')


const app = express()
app.use(cors())

const default_cities = ['karachi','lahore','islamabad','peshawar','gwadar']
const city_data =  []

async function get_data(city){
    if (typeof(city) === 'string'){
        const address = `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${city}`;
        const data = await axios.get(address)
        city_data.push(data.data)
    }
}

default_cities.map((city)=>{get_data(city)})

const server = http.createServer(app)
const io = socketIo(server,{ 
    cors: {
      origin: 'http://localhost:3000'
    }
})

io.on('connection',(socket)=>{
    const local_arr = [...default_cities]

    console.log("connection established",socket.id)
    /* associate user id from socket id here*/

    socket.emit('data-client',city_data)

    socket.on('get_data_req',(data)=>{
        local_arr.push(data)
        console.log(socket.id,local_arr)
        socket.emit('send-data-client',/* some data will be here*/)
    })

    socket.on('disconnect',()=>{
        console.log('disconnected')
        /* disassociate user id from socket id here*/
    })
})



server.listen(3001,()=>{
    console.log('server running on port 3001')
})

