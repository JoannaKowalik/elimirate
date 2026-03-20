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
//unnecessary?
export const getPlayersByRoom = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}/players`);
};

export const getPlayerPredictions = (roomCode, playerId) => {
  return axios.get(
    `http://localhost:4000/api/rooms/${roomCode}/players/${playerId}/predictions`,
  );
};

export const getScores = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}/scores`);
};

export const getPlayerIdByNameAndRoom = (display_name, roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}/players/id`, {
    params: {
      display_name,
    },
  });
};

export const getRevealIndex = (roomCode) =>
  axios.get(`http://localhost:4000/api/rooms/${roomCode}/reveal-index`);

export const revealNext = (roomCode) =>
  axios.post(`http://localhost:4000/api/rooms/${roomCode}/reveal-next`);
