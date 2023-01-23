import "./App.css";
import Welcome from "./component/Welcome";
import Index from "./component/Index";
// import { useEffect, useState } from 'react';
import io from "socket.io-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import { useState } from "react";

const socket = io.connect("http://localhost:3001/");

function App() {
  const [shouldLogin, setShouldLogin] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Index socket={socket} />} />
          <Route
            path="login"
            element={<Login socket={socket} setShouldLogin={setShouldLogin} />}
          />
          <Route path="signup" element={<Register socket={socket} />} />
          <Route
            path="welcome"
            element={
              shouldLogin ? (
                <Welcome socket={socket} />
              ) : (
                <Index socket={socket} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
