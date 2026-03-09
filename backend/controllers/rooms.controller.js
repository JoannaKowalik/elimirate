const roomService = require("../services/room.service");

async function createRoom(req, res) {
  try {
    console.log("Request body:", req.body);
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

/*
async function getRoomSeason(req, res) {
  try {
    const season = await roomService.getRoomSeason(req.params.roomId);

    if (!season) {
      return res
        .status(404)
        .json({ message: "Season not found for this room" });
    }

    res.json(season);
  } catch (err) {
    console.error("Error fetching season:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}*/

async function getContestantsByRoomId(req, res) {
  try {
    const contestants = await roomService.getContestantsByRoomId(
      req.params.roomId,
    );

    if (!contestants) {
      return res
        .status(404)
        .json({ message: "Contestants not found for this room" });
    }

    res.json(contestants);
  } catch (err) {
    console.error("Error fetching contestants:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createRoom,
  getRoomByCode,
  //getRoomSeason,
  getContestantsByRoomId,
};
