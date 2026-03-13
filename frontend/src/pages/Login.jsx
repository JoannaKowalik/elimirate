import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    roomCode: "",
    moderator_name: "",
  });
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    try {
      navigate(
        "/room/" + values.roomCode + "/player/" + values.moderator_name,
        {
          state: {
            roomCode: values.roomCode,
            moderator_name: values.moderator_name,
          },
        },
      );
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
        <label htmlFor="moderator_name">Your name:</label>
        <input
          type="text"
          value={values.moderator_name}
          onChange={(e) =>
            setValues({ ...values, moderator_name: e.target.value })
          }
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default Login;
