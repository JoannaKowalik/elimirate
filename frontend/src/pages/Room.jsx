import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRoomByCode,
  //getPlayersByRoom,
  getPlayerPredictions,
} from "../services/roomApi";

function Room() {
  const { roomCode, playerId } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  //const [players, setPlayers] = useState([]);
  const [predictions, setPredictions] = useState([]);

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

    const fetchPredictions = async () => {
      try {
        const response = await getPlayerPredictions(roomCode, playerId);
        setPredictions(response.data.predictions);
        setPlayerName(response.data.display_name);
      } catch (error) {
        console.error("Error fetching predictions:", error);
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
  }, [roomCode, playerId]);
  if (error) return <p>{error}</p>;
  if (!room) return <p>Loading...</p>;

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
    </div>
  );
}

export default Room;
