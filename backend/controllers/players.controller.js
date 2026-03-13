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
/*
async function getPlayerNameByRoomAndName(req, res) {
  try {
    const { roomCode, playerName } = req.params;
    const player = await playerService.getPlayerByRoomAndName(
      roomCode,
      playerName,
    );
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    console.error("Get player error:", err);
    res.status(500).json({ message: "Failed to get player" });
  }
}*/

module.exports = {
  addPlayer,
  //getPlayerNameByRoomAndName,
};
