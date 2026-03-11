import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getContestantsByRoomCode,
  submitPredictions,
} from "../services/roomApi";

function Predictions() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [contestants, setContestants] = useState([]);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    display_name: "",
    predictions: [], //array of contestant ids from best (1) to worst (number od contestants)
  });

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

    if (values.predictions.length !== contestants.length) {
      alert("Please rank all contestants before submitting.");
      return;
    }

    try {
      console.log("Submitting:", { ...values, roomCode });
      const res = await submitPredictions(roomCode, values);
      console.log(res.data);

      navigate("/room/" + roomCode, {
        state: { ...values },
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
  if (!contestants) return <p>Loading...</p>;

  return (
    <div>
      <h1>Input Predictions</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="display_name">Your name:</label>
        <input
          type="text"
          value={values.display_name}
          //id="display_name"
          //name="display_name"
          required
          onChange={(e) =>
            setValues({ ...values, display_name: e.target.value })
          }
        />

        <label htmlFor="predicted_position">Your predictions:</label>
        <ol>
          {contestants.map((contestant) => (
            <li key={contestant.id}>
              {contestant.name}
              {""}

              <input
                type="number"
                min="1"
                max={contestants.length}
                required
                onChange={(e) =>
                  handleInputChange(contestant.id, parseInt(e.target.value))
                }
              />
            </li>
          ))}
        </ol>
        <button type="submit">Submit!</button>
      </form>
    </div>
  );
}

export default Predictions;
