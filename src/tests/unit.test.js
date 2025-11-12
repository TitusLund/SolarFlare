// getScores.test.js
const { getScores } = require('../controllers/scoresController.js');
const pool = require('../config/database.js'); // wherever your pool is exported
const { updateScore } = require('../controllers/gameController.js');

// Mock pool.query
jest.mock('../config/database.js', () => ({
  query: jest.fn(),
}));

describe('getScores', () => {
  let req, res;

  beforeEach(() => {
    req = {}; // your function doesn’t use req, so empty is fine

    res = {
      status: jest.fn().mockReturnThis(), // so you can chain .json()
      json: jest.fn(),
    };
  });

  it('should respond with results when query succeeds', () => {
    // Arrange - mock successful DB result
    const mockResults = [
      { username: 'random1', score: 100 },
      { username: 'random2', score: 90 },
    ];
    pool.query.mockImplementation((query, callback) => {
      callback(null, mockResults);
    });

    // Act
    getScores(req, res);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT username, score FROM cst326.scores ORDER BY score DESC",
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  it('should respond with 500 error when query fails', () => {
    pool.query.mockImplementation((query, callback) => {
      callback(new Error('DB error'), null);
    });

    getScores(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});



