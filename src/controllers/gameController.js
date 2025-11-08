const { generateGameboard, shiftLeft, shiftRight, shiftDown, shiftUp, addRandomTile } = require("../logic/MovementLogic");

const activeGames = {};

exports.gameStart = (req, res) => {
	try {
		const gameSessionId = crypto.randomUUID();
		const gameSession = {
			id: gameSessionId,
			player: "",
			status: "active",
			gameBoard: generateGameboard(),
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

exports.shiftPieces = (req, res) => {
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

		switch (direction.toLowerCase()) {
			case "up":
				shiftedBoard = shiftUp(newBoard);
				break;
			case "down":
				shiftedBoard = shiftDown(newBoard);
				break;
			case "left":
				shiftedBoard = shiftLeft(newBoard);
				break;
			case "right":
				shiftedBoard = shiftRight(newBoard);
				break;
			default:
				return res.status(400).json({ message: "Invalid direction" });
		}

		const boardChanged = JSON.stringify(newBoard) !== JSON.stringify(shiftedBoard);
		if (boardChanged) {
			shiftedBoard = addRandomTile(shiftedBoard);
		}

		gameSession.gameBoard = shiftedBoard;

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









