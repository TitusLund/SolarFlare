const express = require('express');
require('dotenv').config();

// Import database connection
const dbConnection = require('./src/config/database');

// Import models
const ScoresModel = require('./src/models/ScoresModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json()); // Parse JSON bodies

// Simple test endpoint to demonstrate database access
app.get('/scores', async (req, res) => {
    try {
        const scoresModel = new ScoresModel();
        const scores = await scoresModel.findAll();
        res.json(scores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add score endpoint
app.post('/scores', async (req, res) => {
    try {
        const scoresModel = new ScoresModel();
        const { username, score } = req.body;
        const newScore = await scoresModel.addScore(username, score);
        res.json(newScore);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`SolarFlare Database Access Layer running on port ${PORT}`);
    console.log(`Test endpoints:`);
    console.log(`  GET /scores - Get all scores`);
    console.log(`  POST /scores - Add new score`);
});
