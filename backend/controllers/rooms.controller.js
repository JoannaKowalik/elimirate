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

module.exports = {
  createRoom,
};
