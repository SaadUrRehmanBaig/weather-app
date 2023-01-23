import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome({ socket }) {
  const [info, setInfo] = useState([]);
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("data-client");
  }, []);
  useEffect(() => {
    socket.on("error", () => {
      alert("enter correct city");
    });
    socket.on("data-client", (data) => {
      setInfo(data);
      console.log(data);
    });

    socket.on("send-data-client", (data) => {
      setInfo(data);
      console.log(data);
    });

    socket.on("data updated", () => {
      console.log("on data updated from client");
      socket.emit("data-client");
    });
  }, [socket]);

  const login = () => {
    navigate("/login");
  };
  const signup = () => {
    navigate("/signup");
  };
  return (
    <div>
      <nav className="navbar bg-secondary px-2 " data-bs-theme="dark">
        <h1 className="bg-secondary text-light"> Pak Weather App</h1>
        <button
          type="button"
          class="btn btn-warning float-right ml-2 mr-2"
          onClick={login}
        >
          Login
        </button>
        <button
          type="button"
          class="btn btn-primary float-right"
          onClick={signup}
        >
          Signup
        </button>
      </nav>
      <div style={{ height: "100%" }}>
        <div className="text-center pt-4">
          <button
            className="btn btn-outline-info text-center ml-4 text-dark  bg-warning tempbtn"
            onClick={() => {
              setTemp(!temp);
            }}
          >
            {temp ? "°C" : "°F"}
          </button>
        </div>

        <div className="container  pt-5">
          <div className="row">
            {temp ? (
              <>
                {Object.keys(info).map((city_data) => {
                  let city_data_details = info[city_data];
                  return (
                    <div className="col-12 col-md-4 my-4" key={city_data}>
                      <div
                        className="card text-dark border border-info rounded-3 "
                        style={{ width: "18rem" }}
                      >
                        <div className="card-body">
                          <img src={city_data_details.current.condition.icon} />
                          <h5 className="card-text">
                            <b>{city_data_details.location.name}</b>{" "}
                          </h5>
                          <p className="card-text">
                            <b>{city_data_details.current.condition.text}</b>{" "}
                          </p>
                          <p className="card-text">
                            <b>
                              Tempreture {city_data_details.current.temp_c} °C
                            </b>{" "}
                          </p>
                          <p className="card-text">
                            <b>
                              Humidity {city_data_details.current.humidity}%{" "}
                            </b>
                          </p>
                          <p className="card-text">
                            <b>
                              {" "}
                              {city_data_details.location.region},{" "}
                              {city_data_details.location.country}
                            </b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {Object.keys(info).map((city_data) => {
                  let city_data_details = info[city_data];
                  return (
                    <div className="col-12 col-md-4 my-4" key={city_data}>
                      <div
                        className="card text-dark border border-info rounded-3 "
                        style={{ width: "18rem" }}
                      >
                        <div className="card-body">
                          <img src={city_data_details.current.condition.icon} />
                          <h5 className="card-text">
                            <b>{city_data_details.location.name}</b>{" "}
                          </h5>
                          <p className="card-text">
                            <b>{city_data_details.current.condition.text}</b>{" "}
                          </p>
                          <p className="card-text">
                            <b>
                              Tempreture {city_data_details.current.temp_f} °F
                            </b>{" "}
                          </p>
                          <p className="card-text">
                            <b>
                              Humidity {city_data_details.current.humidity}%{" "}
                            </b>
                          </p>
                          <p className="card-text">
                            <b>
                              {" "}
                              {city_data_details.location.region},{" "}
                              {city_data_details.location.country}
                            </b>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
