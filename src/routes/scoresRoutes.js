const express = require("express");
const router = express.Router();

const{ getScores } = require("../controllers/ScoresController.js")

router.get("/", getScores)

module.exports = router;