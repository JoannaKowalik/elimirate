import axios from "axios";

export const getRoomByCode = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}`);
};

export const getContestantsByRoomId = (roomCode) => {
  return axios.get(`http://localhost:4000/api/rooms/${roomCode}/predictions`);
};
