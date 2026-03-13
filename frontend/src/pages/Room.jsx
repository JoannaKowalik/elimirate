import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomByCode, getPlayerNameByRoomAndName } from "../services/roomApi";

function Room() {
  const { roomCode, playerName } = useParams();
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      console.log("roomCode from URL:", roomCode);
      try {
        const url = `http://localhost:4000/api/rooms/${roomCode}`;
        console.log("Calling API:", url);

        const response = await getRoomByCode(roomCode);
        console.log("API response:", response.data);
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching room");
      }
    };
    fetchRoom();
  }, [roomCode]);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const url = `http://localhost:4000/api/rooms/${roomCode}/players/${playerName}`;
        console.log("Calling API:", url);

        const response = await getPlayerNameByRoomAndName(roomCode, playerName);
        console.log("API response:", response.data);
        setPlayer(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching room");
      }
    };
    fetchPlayer();
  }, [roomCode, playerName]);

  if (error) return <p>{error}</p>;
  if (!room) return <p>Loading...</p>;

  return (
    <div>
      <h1>Room</h1>

      <div>Room Code: {room.room_code}</div>
      <div>Player Name: {player?.name}</div>
    </div>
  );
}

export default Room;
