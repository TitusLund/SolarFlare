const express = require("express");
const router = express.Router();
const { gameStart } = require("../controllers/gameController");

router.post("/start", gameStart);

module.exports = router;
