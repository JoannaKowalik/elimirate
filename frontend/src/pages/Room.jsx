import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRoomByCode,
  //getPlayersByRoom,
  getPlayerPredictions,
  getScores,
  revealNext,
} from "../services/roomApi";

function Room() {
  const { roomCode, playerId } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  //const [players, setPlayers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [scores, setScores] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  const [episodeId, setEpisodeId] = useState(1);

  const fetchScores = async () => {
    try {
      const response = await getScores(roomCode);
      console.log("API response for scores:", response.data);
      setScores(response.data.scores);
      setTotalScores(response.data.totalScores);
      return response.data; // ✅ Return data for logging
    } catch (error) {
      console.error("Error fetching scores:", error);
      return null;
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await getPlayerPredictions(roomCode, playerId);
      setPredictions(response.data.predictions);
      setPlayerName(response.data.display_name);
      return response.data; // ✅ Return data for logging
    } catch (error) {
      console.error("Error fetching predictions:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      console.log("roomCode from URL:", roomCode);
      try {
        const url = `http://localhost:4000/api/rooms/${roomCode}`;
        console.log("Calling API. (room):", url);

        const response = await getRoomByCode(roomCode);
        console.log("API response (room):", response.data);
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
        setError("Error fetching room");
      }
    };

    /*
    const fetchPlayers = async () => {
      try {
        const url = `http://localhost:4000/api/rooms/${roomCode}/players`;
        console.log("Calling API for players:", url);

        const response = await getPlayersByRoom(roomCode);
        console.log("API response for players:", response.data);
        setPlayers(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };*/

    fetchRoom();
    fetchPredictions();
    //fetchPlayers();
    fetchScores();
  }, [roomCode, playerId]);
  if (error) return <p>{error}</p>;
  if (!room) return <p>Loading...</p>;

  async function handleRevealNext() {
    try {
      // Step 1: increment reveal_index
      await revealNext(roomCode);

      // Step 2: fetch latest scores and predictions
      const scoresResponse = await fetchScores();
      console.log("Updated Scores:", scoresResponse);

      const predictionsResponse = await fetchPredictions();
      console.log("Updated Predictions:", predictionsResponse);
    } catch (error) {
      console.error("Reveal failed:", error.response?.data || error.message);
    }
  }

  return (
    <div>
      <h1>Room</h1>
      <div>Room Code: {room.room_code}</div>
      <div>Hello {playerName}</div>
      <ol>
        {predictions.map(
          (
            contestant, //map alphabetically
          ) => (
            <li key={contestant.id}>
              {contestant.name}
              {contestant.predicted_position}
            </li>
          ),
        )}
      </ol>
      <h2>Scores</h2>
      {room.moderator_player === Number(playerId) && (
        <button onClick={handleRevealNext}>Reveal Next Contestant</button>
      )}
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Contestant</th>
            <th>Episode</th>
            <th>Actual Position</th>
            <th>Predicted Position</th>
            <th>Penalty Points</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.display_name}</td>
              <td>{score.name}</td>
              <td>{score.episode_number}</td>
              <td>{score.actual_position}</td>
              <td>{score.predicted_position}</td>
              <td>{score.penalty_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total Scores</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {totalScores.map((score, index) => (
            <tr key={index}>
              <td>{score.display_name}</td>
              <td>{score.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Room;
