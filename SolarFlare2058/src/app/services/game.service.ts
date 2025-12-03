import { Injectable } from '@angular/core';

export interface GameState {
  board: number[];
  score: number;
  gameOver: boolean;
  hasWon: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly GRID_SIZE = 4;
  private readonly BOARD_SIZE = 16;

  constructor() { }

  /**
   * Initialize a new game board with two random tiles
   */
  initializeGame(): GameState {
    const board = new Array(this.BOARD_SIZE).fill(0);
    this.addRandomTile(board);
    this.addRandomTile(board);

    return {
      board,
      score: 0,
      gameOver: false,
      hasWon: false
    };
  }

  /**
   * Add a random tile (90% chance of 2, 10% chance of 4) to empty space
   */
  private addRandomTile(board: number[]): boolean {
    const emptyCells = this.getEmptyCells(board);

    if (emptyCells.length === 0) {
      return false; // No empty cells available
    }

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    board[randomIndex] = randomValue;

    return true;
  }

  /**
   * Get all empty cell indices
   */
  private getEmptyCells(board: number[]): number[] {
    const emptyCells: number[] = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  }

  /**
   * Move tiles left and handle merging
   */
  moveLeft(gameState: GameState): GameState {
    const newBoard = [...gameState.board];
    let newScore = gameState.score;
    let moved = false;

    for (let row = 0; row < this.GRID_SIZE; row++) {
      const rowStart = row * this.GRID_SIZE;
      const rowValues = this.getRow(newBoard, row);
      const { values: newRowValues, score: rowScore, hasMoved } = this.processLine(rowValues);

      if (hasMoved) {
        moved = true;
      }

      newScore += rowScore;

      // Update the board with new row values
      for (let col = 0; col < this.GRID_SIZE; col++) {
        newBoard[rowStart + col] = newRowValues[col];
      }
    }

    if (moved) {
      this.addRandomTile(newBoard);
    }

    return {
      ...gameState,
      board: newBoard,
      score: newScore,
      gameOver: this.isGameOver(newBoard),
      hasWon: gameState.hasWon || this.checkWin(newBoard)
    };
  }

  /**
   * Move tiles right and handle merging
   */
  moveRight(gameState: GameState): GameState {
    const newBoard = [...gameState.board];
    let newScore = gameState.score;
    let moved = false;

    for (let row = 0; row < this.GRID_SIZE; row++) {
      const rowValues = this.getRow(newBoard, row);
      const reversedRow = [...rowValues].reverse();
      const { values: newRowValues, score: rowScore, hasMoved } = this.processLine(reversedRow);

      if (hasMoved) {
        moved = true;
      }

      newScore += rowScore;

      // Reverse back and update the board
      const finalRowValues = [...newRowValues].reverse();
      const rowStart = row * this.GRID_SIZE;
      for (let col = 0; col < this.GRID_SIZE; col++) {
        newBoard[rowStart + col] = finalRowValues[col];
      }
    }

    if (moved) {
      this.addRandomTile(newBoard);
    }

    return {
      ...gameState,
      board: newBoard,
      score: newScore,
      gameOver: this.isGameOver(newBoard),
      hasWon: gameState.hasWon || this.checkWin(newBoard)
    };
  }

  /**
   * Move tiles up and handle merging
   */
  moveUp(gameState: GameState): GameState {
    const newBoard = [...gameState.board];
    let newScore = gameState.score;
    let moved = false;

    for (let col = 0; col < this.GRID_SIZE; col++) {
      const colValues = this.getColumn(newBoard, col);
      const { values: newColValues, score: colScore, hasMoved } = this.processLine(colValues);

      if (hasMoved) {
        moved = true;
      }

      newScore += colScore;

      // Update the board with new column values
      for (let row = 0; row < this.GRID_SIZE; row++) {
        newBoard[row * this.GRID_SIZE + col] = newColValues[row];
      }
    }

    if (moved) {
      this.addRandomTile(newBoard);
    }

    return {
      ...gameState,
      board: newBoard,
      score: newScore,
      gameOver: this.isGameOver(newBoard),
      hasWon: gameState.hasWon || this.checkWin(newBoard)
    };
  }

  /**
   * Move tiles down and handle merging
   */
  moveDown(gameState: GameState): GameState {
    const newBoard = [...gameState.board];
    let newScore = gameState.score;
    let moved = false;

    for (let col = 0; col < this.GRID_SIZE; col++) {
      const colValues = this.getColumn(newBoard, col);
      const reversedCol = [...colValues].reverse();
      const { values: newColValues, score: colScore, hasMoved } = this.processLine(reversedCol);

      if (hasMoved) {
        moved = true;
      }

      newScore += colScore;

      // Reverse back and update the board
      const finalColValues = [...newColValues].reverse();
      for (let row = 0; row < this.GRID_SIZE; row++) {
        newBoard[row * this.GRID_SIZE + col] = finalColValues[row];
      }
    }

    if (moved) {
      this.addRandomTile(newBoard);
    }

    return {
      ...gameState,
      board: newBoard,
      score: newScore,
      gameOver: this.isGameOver(newBoard),
      hasWon: gameState.hasWon || this.checkWin(newBoard)
    };
  }

  /**
   * Process a line (row or column) for merging and moving
   * This is the core 2048 logic for your assignment
   */
  private processLine(line: number[]): { values: number[], score: number, hasMoved: boolean } {
    const originalLine = [...line];

    // Step 1: Remove zeros (move tiles towards the direction)
    const nonZeroValues = line.filter(val => val !== 0);

    // Step 2: Merge adjacent tiles with same values
    const mergedValues: number[] = [];
    let score = 0;
    let i = 0;

    while (i < nonZeroValues.length) {
      if (i < nonZeroValues.length - 1 && nonZeroValues[i] === nonZeroValues[i + 1]) {
        // Merge tiles: double the value and remove the second tile
        const mergedValue = nonZeroValues[i] * 2;
        mergedValues.push(mergedValue);
        score += mergedValue;
        i += 2; // Skip the next tile as it was merged
      } else {
        // No merge, just move the tile
        mergedValues.push(nonZeroValues[i]);
        i++;
      }
    }

    // Step 3: Pad with zeros to maintain line length
    while (mergedValues.length < this.GRID_SIZE) {
      mergedValues.push(0);
    }

    // Check if the line actually changed
    const hasMoved = !this.arraysEqual(originalLine, mergedValues);

    return {
      values: mergedValues,
      score,
      hasMoved
    };
  }

  /**
   * Get row values from board
   */
  private getRow(board: number[], rowIndex: number): number[] {
    const row: number[] = [];
    const rowStart = rowIndex * this.GRID_SIZE;
    for (let i = 0; i < this.GRID_SIZE; i++) {
      row.push(board[rowStart + i]);
    }
    return row;
  }

  /**
   * Get column values from board
   */
  private getColumn(board: number[], colIndex: number): number[] {
    const column: number[] = [];
    for (let i = 0; i < this.GRID_SIZE; i++) {
      column.push(board[i * this.GRID_SIZE + colIndex]);
    }
    return column;
  }

  /**
   * Check if two arrays are equal
   */
  private arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  /**
   * Check if the game is over (no more moves possible)
   */
  private isGameOver(board: number[]): boolean {
    // Check for empty cells
    if (this.getEmptyCells(board).length > 0) {
      return false;
    }

    // Check for possible merges horizontally
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE - 1; col++) {
        const index = row * this.GRID_SIZE + col;
        if (board[index] === board[index + 1]) {
          return false; // Merge possible
        }
      }
    }

    // Check for possible merges vertically
    for (let col = 0; col < this.GRID_SIZE; col++) {
      for (let row = 0; row < this.GRID_SIZE - 1; row++) {
        const index = row * this.GRID_SIZE + col;
        const indexBelow = (row + 1) * this.GRID_SIZE + col;
        if (board[index] === board[indexBelow]) {
          return false; // Merge possible
        }
      }
    }

    return true; // No moves possible
  }

  /**
   * Check if player has won (reached 2048 tile)
   */
  private checkWin(board: number[]): boolean {
    return board.includes(2048);
  }

  /**
   * Detect if there are two tiles next to each other with the same number
   * This fulfills your requirement: "detect if there are two tiles next to each other with the same number"
   */
  detectAdjacentSameTiles(board: number[]): { found: boolean, positions: number[][] } {
    const adjacentPairs: number[][] = [];

    // Check horizontal adjacent tiles
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE - 1; col++) {
        const index1 = row * this.GRID_SIZE + col;
        const index2 = row * this.GRID_SIZE + (col + 1);

        if (board[index1] !== 0 && board[index1] === board[index2]) {
          adjacentPairs.push([index1, index2]);
        }
      }
    }

    // Check vertical adjacent tiles
    for (let col = 0; col < this.GRID_SIZE; col++) {
      for (let row = 0; row < this.GRID_SIZE - 1; row++) {
        const index1 = row * this.GRID_SIZE + col;
        const index2 = (row + 1) * this.GRID_SIZE + col;

        if (board[index1] !== 0 && board[index1] === board[index2]) {
          adjacentPairs.push([index1, index2]);
        }
      }
    }

    return {
      found: adjacentPairs.length > 0,
      positions: adjacentPairs
    };
  }
}
