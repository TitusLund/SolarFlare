const activeGames = {};

exports.gameStart = (req, res) => {
	try {
		const gameSessionId = crypto.randomUUID();
		const gameSession = {
			id: gameSessionId,
			player: "",
			status: "active",
			gameBoard: [],
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
