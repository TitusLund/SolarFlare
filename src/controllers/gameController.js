const { isLeaderboardPos } = require("../db/scoresDB");
const { generateGameboard, shiftLeft, shiftRight, shiftDown, shiftUp, addRandomTile, isGameOver } = require("../logic/MovementLogic");

const activeGames = {};

exports.gameStart = (req, res) => {
	try {
		const gameSessionId = crypto.randomUUID();
		const gameSession = {
			id: gameSessionId,
			player: "",
			status: "active",
			gameBoard: generateGameboard(),
			score: 0
		};
		activeGames[gameSessionId] = gameSession;
		console.log(activeGames);

		res.status(200).json({
			message: "Game started successfully!",
			game: gameSession,
		})
	} catch (error) {
		res.status(500).json({
			message: "Failed to start game",
			error: error.message,
		});
	}
};

exports.shiftPieces = async (req, res) => {

	try {
		const { gameId, direction } = req.body;

		if (!gameId || !direction) {
			return res.status(400).json({ message: "Missing gameId or direction" });
		}

		const gameSession = activeGames[gameId];
		if (!gameSession) {
			return res.status(404).json({ message: "Game not found" });
		}

		let newBoard = [...gameSession.gameBoard];
		let shiftedBoard;

		let updateScore = (scoreToAdd) => {
			gameSession.score += scoreToAdd
		}

		switch (direction.toLowerCase()) {
			case "up":
				shiftedBoard = shiftUp(newBoard, updateScore);
				break;
			case "down":
				shiftedBoard = shiftDown(newBoard, updateScore);
				break;
			case "left":
				shiftedBoard = shiftLeft(newBoard, updateScore);
				break;
			case "right":
				shiftedBoard = shiftRight(newBoard, updateScore);
				break;
			default:
				return res.status(400).json({ message: "Invalid direction" });
		}

		const boardChanged = JSON.stringify(newBoard) !== JSON.stringify(shiftedBoard);
		if (boardChanged) {
			shiftedBoard = addRandomTile(shiftedBoard);
		}

		gameSession.gameBoard = shiftedBoard;

		if (isGameOver(shiftedBoard)) {
			gameSession.status = "gameover";

			let thing = await isLeaderboardPos(gameSession.score)
			return res.status(200).json({
				highscore: thing,
				message: "Game over!",
				game: gameSession,
			});
		}

		res.status(200).json({
			message: boardChanged ? "Move successful" : "No tiles moved",
			game: gameSession,
		})
	} catch (error) {
		res.status(500).json({
			message: "Failed to shift pieces",
			error: error.message,
		});
	}
}









