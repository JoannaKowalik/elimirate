import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/esm/FormGroup";

function Create() {
  const [values, setValues] = useState({
    season_number: "",
    moderator_name: "",
    //numPlayers: 0, //if more than selected number join, refuse access
  });

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    //generate id and room code
    //send to backend, create room in db
    axios
      .post("http://localhost:4000/api/rooms", values)
      .then((res) => {
        //redirect to prediction page, pass room code and mod name as props. Link popup??
        navigate("/room/" + res.data.roomCode + "/predictions/", {
          state: {
            roomCode: res.data.roomCode,
            moderator_name: values.moderator_name,
          },
        });
        //console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="d-flex flex-column my-auto justify-content-center vh-100 p-5">
      <div className="vh-100 background2"></div>
      <h1>Create a new Room</h1>

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <Form.Label htmlFor="moderator_name">Your name:</Form.Label>
          <Form.Control
            type="text"
            id="moderator_name"
            name="moderator_name"
            required
            placeholder="Name"
            onChange={(e) =>
              setValues({ ...values, moderator_name: e.target.value })
            }
          />

          <Form.Label htmlFor="numPlayers">Number of Players (2-6):</Form.Label>
          <Form.Select
            type="number"
            id="numPlayers"
            name="numPlayers"
            min="2"
            max="6"
            required
            onChange={
              (e) =>
                setValues({ ...values, numPlayers: parseInt(e.target.value) }) //pass to predictions, if more than selected number join, refuse access
            }
          >
            <option value="" disabled>
              Select a number of players
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </Form.Select>

          <Form.Label htmlFor="season_number">Pick a season</Form.Label>
          <Form.Select
            value={values.season_number}
            name="season_number"
            id="season_number"
            required
            onChange={(e) =>
              setValues({ ...values, season_number: Number(e.target.value) })
            }
            //fix values!!!
          >
            <option value="" disabled>
              Select a season
            </option>
            <option value="1">Season 5</option>
            <option value="2">Season 6</option>
            <option value="3">Season 7</option>
          </Form.Select>

          <Button type="submit" className="mt-3 " variant="warning">
            Create a Room
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
}

export default Create;
