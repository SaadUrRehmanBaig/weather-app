import './App.css';
import {useEffect, useState} from 'react';
import io from "socket.io-client"

const socket = io.connect("http://localhost:3001/")

function App() {

  socket.on('data-client',(data)=>{
    console.log(data)
  })

  socket.on('send-data-client',()=>{
    console.log('hello from send-data-client')
  })

  const get_data = (e)=>{
    e.preventDefault()
    console.log(123)
    socket.emit('get_data_req',city)
  }  

  const [city,setCity]=useState("")
  return (
    <div className="App">
      <form>
        <label>
          city:
          <input type="text" name="city" onChange={(e)=>{setCity(e.target.value)}} />
        </label>
        <label>
          email:
          <input type="email" name="email" />
        </label>
        <label>
          password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" onClick={get_data}/>
      </form>
    </div>
  );
}

export default App;
