# SolarFlare Database Access Layer

A Node.js Express API server providing database access layer for the SolarFlare capstone project.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- Git

### Installation

1. **Clone the repository** (or ensure you're in the correct directory)
   ```bash
   cd /Users/juliaparaizo/cst-326
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=solarflare_db
   ```

4. **Import your DDL file** (from your GitHub repository)
   - Locate the DDL file in your GitHub repository
   - Import it to create the database structure
   ```bash
   mysql -u your_username -p solarflare_db < path/to/your/ddl_file.sql
   ```

5. **Start the server**
   
   For development (with auto-reload):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
cst-326/
├── src/
│   ├── models/          # Database models
│   │   ├── BaseModel.js # Base class with common CRUD operations
│   │   └── UserModel.js # Example user model
│   ├── controllers/     # Business logic controllers
│   ├── routes/          # API route definitions
│   └── config/
│       └── database.js  # Database connection configuration
├── server.js           # Main application entry point
├── .env.example        # Environment variables template
└── package.json        # Project dependencies
```

## 🛠️ Available Endpoints

- `GET /health` - Health check and database connection status
- `GET /api` - API information and available endpoints

## 📊 Database Access Layer Features

### BaseModel Class
All models extend the `BaseModel` class which provides:
- `findAll(options)` - Find all records with optional filtering
- `findById(id)` - Find a record by ID
- `findBy(criteria)` - Find records by specific criteria
- `create(data)` - Create a new record
- `update(id, data)` - Update a record by ID
- `delete(id)` - Delete a record by ID
- `count(criteria)` - Count records with optional criteria
- `customQuery(query, params)` - Execute custom SQL queries

### Example Usage

```javascript
const UserModel = require('./src/models/UserModel');
const userModel = new UserModel();

// Get all users
const users = await userModel.findAll();

// Find user by ID
const user = await userModel.findById(1);

// Create new user
const newUser = await userModel.create({
    username: 'john_doe',
    email: 'john@example.com',
    name: 'John Doe'
});

// Update user
const updatedUser = await userModel.update(1, {
    name: 'John Smith'
});
```

## 🔧 Development Workflow

### Adding New Models
1. Create a new model file in `src/models/`
2. Extend the `BaseModel` class
3. Add table-specific methods as needed

Example:
```javascript
const BaseModel = require('./BaseModel');

class ProductModel extends BaseModel {
    constructor() {
        super('products'); // Your table name
    }

    // Add custom methods specific to products
    async findByCategory(category) {
        return await this.findBy({ category: category });
    }
}

module.exports = ProductModel;
```

### Working with GitHub Repository
To safely work with your team's repository:

1. **Create your own branch**
   ```bash
   git checkout -b feature/database-access-layer
   ```

2. **Make your changes and commit regularly**
   ```bash
   git add .
   git commit -m "Add database connection and base model"
   ```

3. **Push your branch**
   ```bash
   git push origin feature/database-access-layer
   ```

4. **Create a Pull Request** on GitHub for team review

## 🧪 Testing the Setup

1. **Check server status**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Verify database connection**
   The health endpoint will show database connection status

## 🔒 Security Features

- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Parameterized queries to prevent SQL injection
- Error handling that doesn't expose internal details

## 📝 Next Steps

1. Import your DDL file to create the database structure
2. Create specific models for your tables (extending BaseModel)
3. Add controllers for business logic
4. Create API routes for your endpoints
5. Test your API endpoints

## 🤝 Contributing

When working with your team:
1. Always create a new branch for your features
2. Test your changes before committing
3. Use clear commit messages
4. Create pull requests for code review
5. Keep your local repository updated with the main branch

## 📞 Support

If you encounter any issues:
1. Check the server logs for error messages
2. Verify your database connection settings
3. Ensure all environment variables are set correctly
4. Test the database connection using the health endpoint
