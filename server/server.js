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

    socket.emit('data-client',/* some default data will be here*/)

    socket.on('get_data_req',(data)=>{
        console.log(data)
        socket.emit('send-data-client',/* some default data will be here*/)
    })
})

server.listen(3001,()=>{
    console.log('server running on port 3001')
})


// setInterval(() => {
    
// }, 300000);