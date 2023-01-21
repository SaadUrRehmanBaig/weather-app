const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIo = require("socket.io")


const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketIo(server,{ 
    cors: {
      origin: 'http://localhost:3000'
    }
})

io.on('connection',(socket)=>{
    console.log("saad",socket.id)
})

server.listen(3001,()=>{
    console.log('server running on port 3001')
})