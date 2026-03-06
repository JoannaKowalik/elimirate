const roomService = require("../services/room.service");

async function createRoom(req, res) {
  try {
    const room = await roomService.createRoom(req.body);

    res.json({
      message: "Room created successfully",
      ...room,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating room");
  }
}

async function getRoomByCode(req, res) {
  try {
    console.log("roomService:", roomService);
    console.log("roomCode:", req.params.roomCode);

    const room = await roomService.getRoomByCode(req.params.roomCode);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    console.error("Error fetching room:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createRoom,
  getRoomByCode,
};
