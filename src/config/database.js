const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Database Connection Configuration
 * MySQL connection pool
 * This file establishes and manages the connection to the MySQL database - 
 * handles connection management and error handling
 */

class DatabaseConnection {
    constructor() {
        this.pool = null;
        this.init();
    }

    /**
     * Initialize the database connection pool
     */
    init() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                acquireTimeout: 60000,
                timeout: 60000,
                reconnect: true
            });

            console.log('Database connection pool created successfully');
        } catch (error) {
            console.error('Error creating database connection pool:', error);
            throw error;
        }
    }

    /**
     * Get a connection from the pool
     * @returns {Promise<Connection>} Database connection
     */
    async getConnection() {
        try {
            return await this.pool.getConnection();
        } catch (error) {
            console.error('Error getting database connection:', error);
            throw error;
        }
    }

    /**
     * Execute a query with parameters
     * @param {string} query - SQL query string
     * @param {Array} params - Query parameters
     * @returns {Promise<Array>} Query results
     */
    async query(query, params = []) {
        let connection;
        try {
            connection = await this.getConnection();
            const [results] = await connection.execute(query, params);
            return results;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Test the database connection
     * @returns {Promise<boolean>} Connection status
     */
    async testConnection() {
        try {
            const connection = await this.getConnection();
            await connection.ping();
            connection.release();
            console.log('Database connection test successful');
            return true;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }

    /**
     * Close all connections in the pool
     */
    async closePool() {
        try {
            if (this.pool) {
                await this.pool.end();
                console.log('Database connection pool closed');
            }
        } catch (error) {
            console.error('Error closing database connection pool:', error);
        }
    }
}

// Export a singleton instance
const dbConnection = new DatabaseConnection();
module.exports = dbConnection;
