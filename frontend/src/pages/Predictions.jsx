import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContestantsByRoomId } from "../services/roomApi";

function Predictions() {
  const { roomCode } = useParams();
  const [contestants, setContestants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        const url = `http://localhost:4000/api/rooms/${roomCode}/predictions`;
        console.log("Calling API:", url);

        const response = await getContestantsByRoomId(roomCode);
        console.log("API response:", response.data);
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

      <ul>
        {contestants.map((contestant, index) => (
          <li key={index}>{contestant.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Predictions;
