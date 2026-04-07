import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRoomByCode,
  //getPlayersByRoom,
  getPlayerPredictions,
  getScores,
  revealNext,
} from "../services/roomApi";

import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";

import CopyLink from "../components/CopyLink";

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

 console.log("Room >Player ID", playerId);
 
    const fetchRoom = async () => {
      console.log("roomCode from URL:", roomCode);
      try {
        const url = `http://localhost:4000/api/rooms/${roomCode}`;
        console.log("Calling API. (room):", url);

        const response = await getRoomByCode(roomCode);
        console.log("Room > fetchRoom > API response (room):", response.data);
        setRoom(response.data);
      } catch (error) {
        console.error("Room > fetchRoom > Error fetching room:", error);
        setError("Error fetching room");
      }
    };
 
  const fetchScores = async () => {
    try {
      const response = await getScores(roomCode);
      console.log("Room > fetchScores1 > API response for scores:", response.data);
      setScores(response.data.scores);
      setTotalScores(response.data.totalScores);
      return response.data;
    } catch (error) {
      console.error("Room > fetchScores > Error fetching scores:", error);
      return null;
    }
  };

  const fetchPredictions = async () => {
    try {
      
      const response = await getPlayerPredictions(roomCode, playerId);
     
      console.log("Room > fetchPredictions > API response for predictions:", response.data);
      setPredictions(response.data.predictions);
      setPlayerName(response.data.display_name);
      return response.data;
    } catch (error) {
      console.error("Room > fetchPredictions > Error fetching predictions:", error);
      return null;
    }
  };

  const totalScoresByPlayer = scores.reduce((acc, score) => {
    const name = score.display_name;

    if (!acc[name]) {
      acc[name] = 0;
    }

    acc[name] += score.penalty_points;

    return acc;
  }, {});

  const totalsArray = Object.entries(totalScoresByPlayer).map(
    ([display_name, total_penalty]) => ({
      display_name,
      total_penalty,
    }),
  );

  useEffect(() => {
   

    fetchRoom();
    
    fetchScores();
    if (playerId) {
      fetchPredictions();
    }
  }, [roomCode, playerId]);
  if (error) return <p>{error}</p>;
  if (!room) return <p>Loading...</p>;

  async function handleRevealNext() {
    try {
      // Step 1: increment reveal_index
      await revealNext(roomCode);
      const res = await getScores(roomCode);
      const predictionsResponse = await fetchPredictions();
      console.log("Updated Predictions:", predictionsResponse);
      const scoresResponse = await fetchScores();
      console.log("Updated Scores:", scoresResponse);
      setScores(res.data.scores);
      setTotalScores(res.data.totalScores);
    } catch (error) {
      console.error("Reveal failed:", error.response?.data || error.message);
    }
  }

  return (
    <>
      <h1>Room {room.room_code}</h1>
      <h3>Hello {playerName}!</h3>
      {room.moderator_player === Number(playerId) && (
        <h3>
          Share this link with other players:{" "}
          {/* <a href={`http://localhost:3000/room/${roomCode}/predictions`}>
            http://localhost:3000/room/
            {roomCode}/predictions
          </a> */}
          <CopyLink
            link={`http://localhost:3000/room/${roomCode}/predictions`}
          />
        </h3>
      )}

      <Container>
        <Row>
          <Col>
            <h3>Below are your predictions:</h3>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Contestant</th>
                  <th>Predicted Position</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map(
                  (
                    contestant, //map alphabetically
                  ) => (
                    <tr key={contestant.id}>
                      <td>{contestant.name}</td>
                      <td>{contestant.predicted_position}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </Table>
          </Col>

          <Col>
            <h2>Total Scores:</h2>
            <Table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {totalsArray.map((player, index) => (
                  <tr key={index}>
                    <td>{player.display_name}</td>
                    <td>{player.total_penalty}</td>
                  </tr>
                ))}
              </tbody>
            </Table>{" "}
            <h2>Scores:</h2>
            {room.moderator_player === Number(playerId) && (
              <Button onClick={handleRevealNext}>Reveal Next Contestant</Button>
            )}
            <Table>
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
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Room;
