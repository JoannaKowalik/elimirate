const roomService = require("../services/room.service");
const playerService = require("../services/player.service");

async function addPlayer(req, res) {
  try {
    const { roomCode } = req.params;
    const { display_name } = req.body;

    // 1️⃣ Find the room
    const room = await roomService.getRoomByCode(roomCode);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 2️⃣ Create player with room_id
    const playerId = await playerService.createPlayer({
      display_name,
      room_id: room.id,
    });

    res.status(201).json({
      playerId,
      room_code: roomCode,
    });
  } catch (err) {
    console.error("Add player error:", err);
    res.status(500).json({ message: "Failed to add player" });
  }
}

module.exports = {
  addPlayer,
};
