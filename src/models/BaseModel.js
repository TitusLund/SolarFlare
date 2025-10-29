const dbConnection = require('../config/database');

/**
 * Base Model Class
 * Provides common database operations that can be extended by specific models
 */
class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = dbConnection;
    }

    /**
     * Find all records from the table
     * @param {Object} options - Query options (limit, offset, orderBy)
     * @returns {Promise<Array>} Array of records
     */
    async findAll(options = {}) {
        try {
            let query = `SELECT * FROM ${this.tableName}`;
            const params = [];

            // Add WHERE conditions if provided
            if (options.where) {
                const whereConditions = Object.keys(options.where).map(key => `${key} = ?`);
                query += ` WHERE ${whereConditions.join(' AND ')}`;
                params.push(...Object.values(options.where));
            }

            // Add ORDER BY if provided
            if (options.orderBy) {
                query += ` ORDER BY ${options.orderBy}`;
            }

            // Add LIMIT if provided
            if (options.limit) {
                query += ` LIMIT ${parseInt(options.limit)}`;
            }

            // Add OFFSET if provided
            if (options.offset) {
                query += ` OFFSET ${parseInt(options.offset)}`;
            }

            const results = await this.db.query(query, params);
            return results;
        } catch (error) {
            console.error(`Error in findAll for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Find a record by ID
     * @param {number} id - Record ID
     * @returns {Promise<Object|null>} Record object or null if not found
     */
    async findById(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
            const results = await this.db.query(query, [id]);
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error(`Error in findById for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Find records by specific criteria
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Array>} Array of matching records
     */
    async findBy(criteria) {
        try {
            const whereConditions = Object.keys(criteria).map(key => `${key} = ?`);
            const query = `SELECT * FROM ${this.tableName} WHERE ${whereConditions.join(' AND ')}`;
            const params = Object.values(criteria);

            const results = await this.db.query(query, params);
            return results;
        } catch (error) {
            console.error(`Error in findBy for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Create a new record
     * @param {Object} data - Record data
     * @returns {Promise<Object>} Created record with ID
     */
    async create(data) {
        try {
            const fields = Object.keys(data);
            const values = Object.values(data);
            const placeholders = fields.map(() => '?').join(',');

            const query = `INSERT INTO ${this.tableName} (${fields.join(',')}) VALUES (${placeholders})`;
            const result = await this.db.query(query, values);

            // Return the created record
            if (result.insertId) {
                return await this.findById(result.insertId);
            }
            return { id: result.insertId, ...data };
        } catch (error) {
            console.error(`Error in create for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Update a record by ID
     * @param {number} id - Record ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object|null>} Updated record or null if not found
     */
    async update(id, data) {
        try {
            const fields = Object.keys(data);
            const values = Object.values(data);
            const setClause = fields.map(field => `${field} = ?`).join(',');

            const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
            const params = [...values, id];

            const result = await this.db.query(query, params);

            if (result.affectedRows > 0) {
                return await this.findById(id);
            }
            return null;
        } catch (error) {
            console.error(`Error in update for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Delete a record by ID
     * @param {number} id - Record ID
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async delete(id) {
        try {
            const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
            const result = await this.db.query(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error in delete for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Count records in the table
     * @param {Object} criteria - Optional search criteria
     * @returns {Promise<number>} Record count
     */
    async count(criteria = {}) {
        try {
            let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
            const params = [];

            if (Object.keys(criteria).length > 0) {
                const whereConditions = Object.keys(criteria).map(key => `${key} = ?`);
                query += ` WHERE ${whereConditions.join(' AND ')}`;
                params.push(...Object.values(criteria));
            }

            const results = await this.db.query(query, params);
            return results[0].count;
        } catch (error) {
            console.error(`Error in count for ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Execute custom query
     * @param {string} query - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Array>} Query results
     */
    async customQuery(query, params = []) {
        try {
            return await this.db.query(query, params);
        } catch (error) {
            console.error(`Error in customQuery for ${this.tableName}:`, error);
            throw error;
        }
    }
}

module.exports = BaseModel;
