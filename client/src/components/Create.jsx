import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create() {
  const [values, setValues] = useState({
    season_number: "",
    moderator_name: "",
    //numPlayers: 0, //if more than selected number join, refuse access
  });

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    //generate id and room code, timestamp
    //send to backend, create room in db
    axios
      .post("http://localhost:4000/api/rooms", values)
      .then((res) => {
        //redirect to room page, pass room code and mod name as props. Link popup??
        navigate("/room", {
          state: {
            roomCode: res.data.roomCode,
            moderator_name: values.moderator_name,
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
      <h1>Create a Room</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="moderator_name">Your name:</label>
        <input
          type="text"
          id="moderator_name"
          name="moderator_name"
          required
          onChange={(e) =>
            setValues({ ...values, moderator_name: e.target.value })
          }
        />

        <label htmlFor="numPlayers">Number of Players (2-6):</label>
        <input
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
        />

        <label htmlFor="season_number">Pick a season</label>
        <select
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
        </select>

        <button type="submit">Create a Room</button>
      </form>
    </div>
  );
}

export default Create;
