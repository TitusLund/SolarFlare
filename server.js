
const dotenv = require('dotenv')

dotenv.config();

const express = require('express');
const cors = require('cors');



const gameRoutes = require('./src/routes/gameRoutes');


const scoresRoutes = require('./src/routes/scoresRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow Angular frontend (prevent CORS errors)
app.use(cors({
    // TODO: remove hardcoded localhost here
    origin: "http://app.attem.xyz",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Basic middleware
app.use(express.json()); // Parse JSON bodies
app.use("/api/game", gameRoutes);
app.use("/api/scores", scoresRoutes)

// // Simple test endpoint to demonstrate database access
// app.get('/scores', async (req, res) => {
//     try {
//         const scoresModel = new ScoresModel();
//         const scores = await scoresModel.findAll();
//         res.json(scores);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Add score endpoint
// app.post('/scores', async (req, res) => {
//     try {
//         const scoresModel = new ScoresModel();
//         const { username, score } = req.body;
//         const newScore = await scoresModel.addScore(username, score);
//         res.json(newScore);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Start server
app.listen(PORT, () => {
    console.log(`SolarFlare Database Access Layer running on port ${PORT}`);
    console.log(`Test endpoints:`);
    console.log(`  GET /scores - Get all scores`);
    console.log(`  POST /scores - Add new score`);
});
