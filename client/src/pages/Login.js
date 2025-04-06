import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const data = { userName: userName, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      console.log(response.data);
    });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setuserName(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;