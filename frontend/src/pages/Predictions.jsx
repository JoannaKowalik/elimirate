import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import {
  getContestantsByRoomCode,
  submitPredictions,
} from "../services/roomApi";

function Predictions() {
  const { roomCode } = useParams();
  const location = useLocation();
  const moderator_name = location.state?.moderator_name || null;
  const navigate = useNavigate();
  const [contestants, setContestants] = useState([]);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    display_name: "",
    predictions: [], //array of contestant ids from best (1) to worst (number od contestants)
  });

  //use if drag&drop, else update array on input change
  const handleInputChange = (contestantId, position) => {
    setValues((prev) => {
      const updated = [...prev.predictions];

      const existing = updated.find((p) => p.contestant_id === contestantId);

      if (existing) {
        existing.predicted_position = position;
      } else {
        updated.push({
          contestant_id: contestantId,
          predicted_position: position,
        });
      }

      return { ...prev, predictions: updated };
    });
  };

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
      //console.log("Submitting:", { ...values, roomCode });
      const res = await submitPredictions(roomCode, passedData);
      console.log(res.data);

      navigate("/room/" + roomCode, {
        state: { moderator_name },
      });
    } catch (err) {
      console.error("Error submitting predictions:", err);
      setError("Failed to submit predictions");
    }
  };

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const response = await getContestantsByRoomCode(roomCode);
        setContestants(response.data);
      } catch (error) {
        console.error("Error fetching contestants:", error);
        setError("Error fetching contestants");
      }
    };
    fetchContestants();
  }, [roomCode]);

  if (error) return <p>{error}</p>;
  if (contestants.length === 0) return <p>Loading...</p>;

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
        {/* <label htmlFor="display_name">Your name:</label>
        <input
          type="text"
          value={values.display_name}
          required
          onChange={(e) =>
            setValues({ ...values, display_name: e.target.value })
          }
        /> */}

        <label htmlFor="predicted_position">Your predictions:</label>
        <ol>
          {contestants.map(
            (
              contestant, //map alphabetically
            ) => (
              <li key={contestant.id}>
                {contestant.name}
                {""}

                <input
                  type="number"
                  defaultValue={"1"}
                  min="1"
                  max={contestants.length}
                  required
                  onChange={(e) =>
                    handleInputChange(contestant.id, parseInt(e.target.value))
                  }
                />
              </li>
            ),
          )}
        </ol>
        <button type="submit">Submit!</button>
      </form>
    </div>
  );
}

export default Predictions;
