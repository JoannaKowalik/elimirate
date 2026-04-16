import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  //getRoomByCode,
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
  const [predictions, setPredictions] = useState([]);
  const [scores, setScores] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  //const [episodeId, setEpisodeId] = useState(1);

  console.log("Room >Player ID", playerId);

  async function fetchRoom() {
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //console.log("roomCode from URL:", roomCode);
    try {
      const response = await fetch(
        `http://localhost:4000/api/rooms/${roomCode}`,
      ); //use getRoomByCode?
      // console.log("Calling API. (room):", response);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Room > fetchRoom > API response (room):", result);
      setRoom(result);
    } catch (error) {
      console.error("Room > fetchRoom > Error fetching room:", error);
      setError("Error fetching room"); //displays on page - check user requirements
    }
  }

  async function fetchScores() {
    try {
      const response = await getScores(roomCode);

      console.log(
        "Room > fetchScores1 > API response for scores:",
        response.data,
      );
      setScores(response.data.scores);
      setTotalScores(response.data.totalScores);
      //return response.data;
    } catch (error) {
      console.error("Room > fetchScores > Error fetching scores:", error);
    }
  }

  async function fetchPredictions() {
    try {
      const response = await getPlayerPredictions(roomCode, playerId);

      console.log(
        "Room > fetchPredictions > API response for predictions:",
        response.data,
      );
      setPredictions(response.data.predictions);
      setPlayerName(response.data.display_name);
      // console.log("Player name: " , playerName);
      //return response.data;
    } catch (error) {
      console.error(
        "Room > fetchPredictions > Error fetching predictions:",
        error,
      );
    }
  }

  async function handleRevealNext() {
    try {
      await revealNext(roomCode);
      const res = await getScores(roomCode);
    //updates reveal index and thrn gets scores (all up to reveal index/episode number). then sets scores
      setScores(res.data.scores);
      setTotalScores(res.data.totalScores);
    } catch (error) {
      console.error("Reveal failed:", error.response?.data || error.message);
    }
  }
 
  function totalScoresByPlayer(scores) {
    //takes array of scores

    const totalSc = {}; //new empty object
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      const name = score.display_name;
//use .entries instwad??
      if (!totalSc[name] || totalSc[name] === 0) {
        //name is the key
        //if tgeres no player by that name, add new player with name and score 0
        totalSc[name] = 0;
      }
      totalSc[name] += score.penalty_points; //add points to total score for player [name] key
    }
    return totalSc; //object of player name: total score
  }

 

  //convert totalSc object to arrray
  //https://stackoverflow.com/questions/26795643/how-to-convert-object-containing-objects-into-array-of-objects
  const totalScoresObj = totalScoresByPlayer(scores);
  const totalsArray = Object.keys(totalScoresObj).map((key) => {
    return {
      display_name: key,
      total_penalty: totalScoresObj[key],
    };
  });

  useEffect(() => {
    fetchRoom();
    fetchScores();
    if (playerId) {
      fetchPredictions();
    }
  }, [roomCode, playerId]);
  if (error) return <p>{error}</p>;
  if (!room) return <p>Loading...</p>;

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
              <Button onClick={handleRevealNext} variant="warning">
                Reveal Next Contestant
              </Button>
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
