import { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";

const Register = ({ socket }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassowrd: "",
  });

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const register = () => {
    const { name, email, password, reEnterPassowrd } = user;
    if (name && email && password === reEnterPassowrd) {
      socket.emit("send_user", { userData: user });
      socket.on("User_Registered", (data) => {
        if (data === "User Succefully Registered") {
          console.log("Registered");
          navigate("/login");
        }
      });
    } else {
      alert("invalid input");
    }
  };
  return (
    <div className="main">
      <div className="register">
        <h1> Register </h1>
        <input
          type="text"
          required
          name="name"
          onChange={inputHandler}
          placeholder="Your Full Name"
        />
        <input
          type="email"
          required
          name="email"
          onChange={inputHandler}
          placeholder="Email"
        />
        <input
          type="password"
          required
          name="password"
          onChange={inputHandler}
          placeholder="Enter Your Password"
        />
        <input
          type="password"
          required
          name="reEnterPassowrd"
          onChange={inputHandler}
          placeholder="Re-Enter your password"
        />
        <div className="button" onClick={register}>
          Register
        </div>
        <div>or</div>
        <div className="button">Login</div>
      </div>
    </div>
  );
};

export default Register;
