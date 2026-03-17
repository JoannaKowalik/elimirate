const express = require("express");
const router = express.Router();
const roomsController = require("../controllers/rooms.controller");
const playersController = require("../controllers/players.controller");

router.get("/:roomCode", roomsController.getRoomByCode);

router.post("/", roomsController.createRoom);

router.get("/:roomCode/contestants", roomsController.getContestantsByRoomCode);
router.get("/:roomCode/players/id", playersController.getPlayerIdByNameAndRoom);
module.exports = router;
