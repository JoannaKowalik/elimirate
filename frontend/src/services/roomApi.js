import axios from "axios";

export const getRoomByCode = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}`);
};

export const getContestantsByRoomCode = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}/contestants`);
};

export const submitPredictions = (roomCode, predictions) => {
  return axios.post(
    `http://localhost:4000/api/rooms/${roomCode}/predictions`,
    predictions,
  );
};
