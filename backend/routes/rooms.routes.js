const express = require("express");
const router = express.Router();
const roomsController = require("../controllers/rooms.controller");

router.get("/:roomCode", roomsController.getRoomByCode);

router.post("/", roomsController.createRoom);

module.exports = router;
