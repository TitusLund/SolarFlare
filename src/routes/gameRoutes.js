const express = require("express");
const router = express.Router();
const { gameStart, shiftPieces } = require("../controllers/gameController");

router.post("/start", gameStart);
router.post("/shift", shiftPieces);

module.exports = router;
