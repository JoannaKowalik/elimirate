import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [values, setValues] = useState({
    display_name: "",
    room_code: "", //change to pass room code as prop from join page
  });

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`http://localhost:4000/api/rooms/${values.room_code}/players`, {
        display_name: values.display_name,
      })
      .then((res) => {
        navigate(`/room/${values.room_code}`, {
          state: {
            roomCode: values.room_code,
            display_name: values.display_name,
            playerId: res.data.playerId,
          },
        });
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="display_name">Your name:</label>
        <input
          type="text"
          id="display_name"
          name="display_name"
          required
          onChange={(e) =>
            setValues({ ...values, display_name: e.target.value })
          }
        />

        <label htmlFor="room_code">Room code:</label>
        <input
          type="text"
          id="room_code"
          name="room_code"
          required
          onChange={(e) => setValues({ ...values, room_code: e.target.value })}
        />

        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default Register;
