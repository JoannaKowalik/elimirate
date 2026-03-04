const express = require("express");
const router = express.Router();
const roomsController = require("../controllers/rooms.controller");
const getRoomByCode = require("../services/room.service").getRoomByCode;
const roomService = require("../services/room.service");

router.get("/:roomCode", async (req, res) => {
  try {
    console.log("roomService:", roomService); // 👈 DEBUG
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
});

router.post("/", roomsController.createRoom);

module.exports = router;
