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

const mergeLine = (line) => {
	line = line.filter(num => num !== 0);

	for (let i = 0; i < line.length - 1; i++) {
		if (line[i] === line[i + 1]) {
			line[i] *= 2;
			line[i + 1] = 0;
		}
	}

	line = line.filter(num => num !== 0);
	while (line.length < 4) line.push(0);

	return line;
};

exports.shiftUp = (gameboard) => {
	let newBoard = Array(16).fill(0);
	for (let col = 0; col < 4; col++) {
		let line = [gameboard[col], gameboard[col + 4], gameboard[col + 8], gameboard[col + 12]];
		let merged = mergeLine(line);
		for (let row = 0; row < 4; row++) {
			newBoard[col + row * 4] = merged[row];
		}
	}
	return newBoard;
}

exports.shiftDown = (gameboard) => {
	let newBoard = Array(16).fill(0);
	for (let col = 0; col < 4; col++) {
		let line = [gameboard[col + 12], gameboard[col + 8], gameboard[col + 4], gameboard[col]];
		let merged = mergeLine(line);
		merged.reverse();
		for (let row = 0; row < 4; row++) {
			newBoard[col + row * 4] = merged[row];
		}
	}
	return newBoard;
}

exports.shiftRight = (gameboard) => {
	let newBoard = [];
	for (let row = 0; row < 4; row++) {
		let line = gameboard.slice(row * 4, row * 4 + 4).reverse();
		let merged = mergeLine(line);
		newBoard.push(...merged.reverse());
	}
	return newBoard;
}

exports.shiftLeft = (gameboard) => {
	let newBoard = [];
	for (let row = 0; row < 4; row++) {
		const line = gameboard.slice(row * 4, row * 4 + 4);
		const merged = mergeLine(line);
		newBoard.push(...merged);
	}
	return newBoard;
}

exports.addRandomTile = (gameboard) => {
	const emptyIndices = gameboard.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
	if (emptyIndices.length === 0) return gameboard;
	const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
	gameboard[randomIndex] = Math.random() < 0.9 ? 2 : 4;
	return gameboard;
};





