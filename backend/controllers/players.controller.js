const roomService = require("../services/room.service");
const playerService = require("../services/player.service");

async function addPlayer(req, res) {
  try {
    const { roomCode } = req.params;
    const { display_name } = req.body;

    const room = await roomService.getRoomByCode(roomCode);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const player_id = await playerService.createPlayer({
      display_name,
      room_id: room.id,
    });

    res.status(201).json({
      player_id,
    });
  } catch (err) {
    console.error("Add player error:", err);
    res.status(500).json({ message: "Failed to add player" });
  }
}

async function getPlayerIdByNameAndRoom(req, res) {
  try {
    const { roomCode } = req.params;
    const { display_name } = req.query;

    const player_id = await playerService.getPlayerIdByNameAndRoom(
      display_name,
      roomCode,
    );

    if (!player_id) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ player_id: player_id });
  } catch (err) {
    console.error("Get player ID error:", err);
    res.status(500).json({ message: "Failed to get player ID" });
  }
}

module.exports = {
  addPlayer,
  getPlayerIdByNameAndRoom,
};
