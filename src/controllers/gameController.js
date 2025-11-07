exports.gameStart = (req, res) => {
	try {
		const { gameId } = req.body;

		const gameSession = {
			id: gameId,
			player: "",
			status: "active",
			gameBoard: [],
		};

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
