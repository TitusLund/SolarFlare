

exports.generateGameboard = () => {
	let gameboard = [
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0
	]
	const max = 15;
	const firstNum = Math.floor(Math.random() * max);
	let secondNum = 0;
	do {
		secondNum = Math.floor(Math.random() * max);
	} while (firstNum === secondNum);

	gameboard[firstNum] = 2;
	gameboard[secondNum] = 2;
	// TODO: remove this console.log
	console.log(gameboard);
	return gameboard;
}
