const BaseModel = require('./BaseModel');

/**
 * User Model
 * Handles all database operations related to users
 * Extends BaseModel to inherit common CRUD operations
 */
class UserModel extends BaseModel {
    constructor() {
        super('users'); // Replace 'users' with your actual table name
    }

    /**
     * Find user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User object or null if not found
     */
    async findByEmail(email) {
        try {
            const results = await this.findBy({ email: email });
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('❌ Error finding user by email:', error);
            throw error;
        }
    }

    /**
     * Find user by username
     * @param {string} username - Username
     * @returns {Promise<Object|null>} User object or null if not found
     */
    async findByUsername(username) {
        try {
            const results = await this.findBy({ username: username });
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('❌ Error finding user by username:', error);
            throw error;
        }
    }

    /**
     * Get active users only
     * @returns {Promise<Array>} Array of active users
     */
    async getActiveUsers() {
        try {
            return await this.findBy({ status: 'active' });
        } catch (error) {
            console.error('❌ Error getting active users:', error);
            throw error;
        }
    }

    /**
     * Create a new user with validation
     * @param {Object} userData - User data
     * @returns {Promise<Object>} Created user
     */
    async createUser(userData) {
        try {
            // Add created_at timestamp if not provided
            if (!userData.created_at) {
                userData.created_at = new Date();
            }

            // Set default status if not provided
            if (!userData.status) {
                userData.status = 'active';
            }

            return await this.create(userData);
        } catch (error) {
            console.error('❌ Error creating user:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     * @param {number} userId - User ID
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<Object|null>} Updated user or null if not found
     */
    async updateProfile(userId, profileData) {
        try {
            // Add updated_at timestamp
            profileData.updated_at = new Date();

            return await this.update(userId, profileData);
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            throw error;
        }
    }

    /**
     * Soft delete user (set status to inactive)
     * @param {number} userId - User ID
     * @returns {Promise<Object|null>} Updated user or null if not found
     */
    async deactivateUser(userId) {
        try {
            return await this.update(userId, { 
                status: 'inactive',
                updated_at: new Date()
            });
        } catch (error) {
            console.error('❌ Error deactivating user:', error);
            throw error;
        }
    }

    /**
     * Get users with pagination
     * @param {number} page - Page number (starting from 1)
     * @param {number} limit - Number of records per page
     * @returns {Promise<Object>} Object containing users array and pagination info
     */
    async getUsersPaginated(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const users = await this.findAll({
                limit: limit,
                offset: offset,
                orderBy: 'created_at DESC'
            });

            const totalUsers = await this.count();
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users: users,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalUsers: totalUsers,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('❌ Error getting paginated users:', error);
            throw error;
        }
    }
}

module.exports = UserModel;
