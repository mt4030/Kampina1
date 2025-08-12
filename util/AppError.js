// Custom error class that extends built-in JavaScript Error class
class AppError extends Error {
  // Constructor takes a message and a status code
  constructor(message, status) {
    super(message); // Call the parent Error constructor to set the error message
    this.status = status; // Add a custom 'status' property to hold HTTP status codes (e.g., 404, 500)
  }
}

// Export this class so it can be used throughout the app for consistent error handling
module.exports = AppError;
