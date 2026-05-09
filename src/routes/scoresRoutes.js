const express = require("express");
const router = express.Router();

const{ getScores, saveScore } = require("../controllers/ScoresController.js")

router.get("/getScores", getScores)

router.post("/saveScore", saveScore)

module.exports = router;