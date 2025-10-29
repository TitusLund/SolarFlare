<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SolarFlare Database Access Layer

This is a Node.js Express project for the SolarFlare capstone project, focused on creating a robust database access layer.

## Project Structure
- `src/config/` - Database configuration and connection management
- `src/models/` - Data models extending BaseModel for consistent database operations
- `src/controllers/` - Business logic controllers
- `src/routes/` - API route definitions
- `server.js` - Main application entry point

## Database Access Patterns
- Use the BaseModel class for consistent CRUD operations
- All models should extend BaseModel to inherit common database methods
- Use parameterized queries to prevent SQL injection
- Handle database errors gracefully with proper logging

## Code Style Guidelines
- Use async/await for asynchronous operations
- Include proper error handling with try/catch blocks
- Add meaningful console logs with emoji indicators (✅ for success, ❌ for errors)
- Use JSDoc comments for all functions
- Follow RESTful API conventions for routes

## Security Considerations
- Use environment variables for sensitive configuration
- Sanitize all user inputs
- Use helmet.js for security headers
- Implement proper error messages (don't expose internal details in production)
