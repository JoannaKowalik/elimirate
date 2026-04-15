import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ContestantCard from "../components/ContestantCard";

import {
  getContestantsByRoomCode,
  submitPredictions,
} from "../services/roomApi";

//import { Sortable } from "../components/Sortable";
//import { Sortable } from "@dnd-kit/dom/sortable";
//import { SortableItem } from "../components/SortableItem";
import UseSortable from "../components/UseSortable";
import Button from "react-bootstrap/Button";

function Predictions() {
  const { roomCode } = useParams();
  const location = useLocation(); //gets props
  const moderator_name = location.state?.moderator_name || null; //get name from Create, if not there- null
  const navigate = useNavigate();
  const [contestants, setContestants] = useState([]);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    display_name: "",
    predictions: [], //array of contestant ids from best (1) to worst (number od contestants)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    /*
    if (values.predictions.length !== contestants.length) {
      alert("Please rank all contestants before submitting.");
      return;
    }
      */

    const passedData = {
      display_name: moderator_name || values.display_name,
      predictions: values.predictions,
      moderator_name: moderator_name,
    };

    try {
      const res = await submitPredictions(roomCode, passedData);
      console.log("Response from submitPredictions:", res.data);
      navigate("/room/" + roomCode + "/players/" + res.data.player_id, {
        state: { moderator_name },
      });
      console.log(res.data);
    } catch (err) {
      console.error("Error submitting predictions:", err);
      setError("Failed to submit predictions"); //renders on page
    }
  };

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const response = await getContestantsByRoomCode(roomCode);
        response.data.sort((a, b) => a.name.localeCompare(b.name)); //sort cont alphabetically
        setContestants(response.data);
      } catch (error) {
        console.error("Error fetching contestants:", error);
        setError("Error fetching contestants"); //displays on page
      }
    };
    fetchContestants();
  }, [roomCode]);

  if (error) return <p>{error}</p>;
  if (contestants.length === 0) return <p>Loading...</p>;

  //renderveitherb mod name or user name input if no mod name
  function renderNameInput() {
    if (moderator_name) {
      return (
        <div>
          <p>Hi {moderator_name}!</p>
        </div>
      );
    } else {
      return (
        <div>
          <label htmlFor="display_name">Your name:</label>
          <input
            type="text"
            value={values.display_name}
            required
            onChange={(e) =>
              setValues({ ...values, display_name: e.target.value })
            }
          />
        </div>
      );
    }
  }

  return (
    <div>
      <h1>Input Predictions</h1>

      <form onSubmit={handleSubmit}>
        {renderNameInput()}

        <p>
          Drag the contestant's cards around to rank them from best (1.
          position) to worst (last position).
        </p>
        <p>
          Be careful - you'll score penalty points for incorrect predictions!
        </p>
        <div>
          <UseSortable
            items={contestants}
            onDrag={(newOrder) => {
              const predictions = newOrder.map((cont, index) => ({
                contestant_id: cont.id,
                predicted_position: index + 1,
              }));

              setValues((currentState) => ({
                ...currentState, //add predictions to current state (display name)
                predictions,
              }));
            }}
          >
            {contestants.name}
            <ContestantCard />
          </UseSortable>
        </div>

        <Button type="submit" m-t="3" variant="warning">
          Submit!
        </Button>
      </form>
    </div>
  );
}

export default Predictions;
