const BaseModel = require('./BaseModel');

/**
 * Scores Model
 * Handles all database operations related to game scores
 * Extends BaseModel to inherit common CRUD operations
 */
class ScoresModel extends BaseModel {
    constructor() {
        super('scores'); // Your actual table name
    }

    /**
     * Find scores by username
     * @param {string} username - Player username
     * @returns {Promise<Array>} Array of scores for the user
     */
    async findByUsername(username) {
        try {
            const results = await this.findBy({ username: username });
            return results;
        } catch (error) {
            console.error('Error finding scores by username:', error);
            throw error;
        }
    }

    /**
     * Get top scores with limit
     * @param {number} limit - Number of top scores to return (default: 10)
     * @returns {Promise<Array>} Array of top scores
     */
    async getTopScores(limit = 10) {
        try {
            return await this.findAll({
                orderBy: 'score DESC',
                limit: limit
            });
        } catch (error) {
            console.error('Error getting top scores:', error);
            throw error;
        }
    }

    /**
     * Get leaderboard (all scores ordered by score descending)
     * @returns {Promise<Array>} Array of all scores ordered by highest first
     */
    async getLeaderboard() {
        try {
            return await this.findAll({
                orderBy: 'score DESC'
            });
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            throw error;
        }
    }

    /**
     * Add a new score
     * @param {string} username - Player username
     * @param {number} score - Player score
     * @returns {Promise<Object>} Created score record
     */
    async addScore(username, score) {
        try {
            return await this.create({
                username: username,
                score: score
            });
        } catch (error) {
            console.error('Error adding new score:', error);
            throw error;
        }
    }

    /**
     * Get user's best score
     * @param {string} username - Player username
     * @returns {Promise<Object|null>} Best score record or null if no scores found
     */
    async getBestScore(username) {
        try {
            const query = `
                SELECT * FROM ${this.tableName} 
                WHERE username = ? 
                ORDER BY score DESC 
                LIMIT 1
            `;
            const results = await this.customQuery(query, [username]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error getting best score:', error);
            throw error;
        }
    }

    /**
     * Get user's average score
     * @param {string} username - Player username
     * @returns {Promise<number>} Average score or 0 if no scores found
     */
    async getAverageScore(username) {
        try {
            const query = `
                SELECT AVG(score) as average_score 
                FROM ${this.tableName} 
                WHERE username = ?
            `;
            const results = await this.customQuery(query, [username]);
            return results[0].average_score || 0;
        } catch (error) {
            console.error('Error getting average score:', error);
            throw error;
        }
    }

    /**
     * Get user's rank on leaderboard
     * @param {string} username - Player username
     * @returns {Promise<number>} User's rank (1 = best) or null if user not found
     */
    async getUserRank(username) {
        try {
            const bestScore = await this.getBestScore(username);
            if (!bestScore) return null;

            const query = `
                SELECT COUNT(*) + 1 as rank 
                FROM ${this.tableName} 
                WHERE score > ?
            `;
            const results = await this.customQuery(query, [bestScore.score]);
            return results[0].rank;
        } catch (error) {
            console.error('Error getting user rank:', error);
            throw error;
        }
    }

    /**
     * Get score statistics
     * @returns {Promise<Object>} Statistics including total players, games, highest score, etc.
     */
    async getStatistics() {
        try {
            const query = `
                SELECT 
                    COUNT(DISTINCT username) as total_players,
                    COUNT(*) as total_games,
                    MAX(score) as highest_score,
                    MIN(score) as lowest_score,
                    AVG(score) as average_score
                FROM ${this.tableName}
            `;
            const results = await this.customQuery(query);
            return results[0];
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }

    /**
     * Delete all scores for a user
     * @param {string} username - Player username
     * @returns {Promise<number>} Number of deleted records
     */
    async deleteUserScores(username) {
        try {
            const query = `DELETE FROM ${this.tableName} WHERE username = ?`;
            const result = await this.customQuery(query, [username]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error deleting user scores:', error);
            throw error;
        }
    }
}

module.exports = ScoresModel;
