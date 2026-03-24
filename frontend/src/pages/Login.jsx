import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayerIdByNameAndRoom } from "../services/roomApi";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/esm/FormGroup";

function Login() {
  const [values, setValues] = useState({
    roomCode: "",
    player_name: "",
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await getPlayerIdByNameAndRoom(
        values.player_name,
        values.roomCode,
      );

      const player_id = res.data.player_id;
      navigate("/room/" + values.roomCode + "/players/" + player_id, {
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
    <div className="d-flex flex-column my-auto justify-content-center vh-100">
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <Form.Label htmlFor="room_code">Room Code:</Form.Label>
          <Form.Control
            type="text"
            value={values.roomCode}
            required
            placeholder="Room code"
            onChange={(e) => setValues({ ...values, roomCode: e.target.value })}
          />
          <Form.Label htmlFor="player_name">Your name:</Form.Label>
          <Form.Control
            type="text"
            value={values.player_name}
            placeholder="Name"
            onChange={(e) =>
              setValues({ ...values, player_name: e.target.value })
            }
          />
          <Button type="submit" className="mt-3">
            Join Room
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
}

export default Login;
