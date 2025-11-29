const express = require("express");
const router = express.Router();

const{ getScores, saveScore } = require("../controllers/ScoresController.js")

router.get("/", getScores)

router.post("/", saveScore)

module.exports = router;