import './App.css';
import {useEffect} from 'react';
import io from "socket.io-client"

const socket = io.connect("http://localhost:3001/")

function App() {

  return (
    <div className="App">
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          email:
          <input type="email" name="email" />
        </label>
        <label>
          password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
