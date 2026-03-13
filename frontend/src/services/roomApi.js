import axios from "axios";

export const getRoomByCode = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}`);
};

export const getContestantsByRoomCode = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}/contestants`);
};

export const submitPredictions = (roomCode, passedData) => {
  return axios.post(
    `http://localhost:4000/api/rooms/${roomCode}/predictions`,
    passedData,
  );
};

export const getPlayerNameByRoomAndName = (roomCode, playerName) => {
  return axios.get(
    `http://localhost:4000/api/rooms/${roomCode}/players/${playerName}`,
  );
};
