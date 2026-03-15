import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    roomCode: "",
    player_name: "",
  });
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    try {
      navigate("/room/" + values.roomCode + "/player/" + values.player_name, {
        //player_id!!!
        state: {
          roomCode: values.roomCode,
          player_name: values.player_name,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="room_code">Room Code:</label>
        <input
          type="text"
          value={values.roomCode}
          required
          onChange={(e) => setValues({ ...values, roomCode: e.target.value })}
        />
        <label htmlFor="player_name">Your name:</label>
        <input
          type="text"
          value={values.player_name}
          onChange={(e) =>
            setValues({ ...values, player_name: e.target.value })
          }
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default Login;
