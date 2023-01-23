import "./login.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

let email_user = "";

const Login = ({ socket, setShouldLogin, setEmail }) => {
  const navigate = useNavigate();
  //user input
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //handling user input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //login
  const login = () => {
    const { email, password } = user;
    email_user = email;
    if (email && password) {
      socket.emit("login", { userData: user });
    } else {
      alert("invalid input");
    }
  };

  useEffect(() => {
    socket.on("succesfully logged in", () => {
      const { email, password } = user;
      setShouldLogin(true);
      setEmail(email_user);
      navigate("/welcome");
    });
    socket.on("no user found", () => {
      alert("no such user exists");
    });
    socket.on("password not matched", () => {
      alert("password not matched");
    });
  }, [socket]);

  return (
    <div className="main">
      <div className="login">
        <h1> Login </h1>
        <input
          type="email"
          required
          name="email"
          onChange={(e) => {
            handleChange(e);
          }}
          placeholder="Email"
        />
        <input
          type="password"
          required
          name="password"
          onChange={handleChange}
          placeholder="Enter Your Password"
        />
        <div className="button" onClick={login}>
          Login
        </div>
        <div>or</div>
        <div
          className="button"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Register
        </div>
      </div>
    </div>
  );
};

export default Login;
