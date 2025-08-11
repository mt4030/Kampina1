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

/**
  Production usage and connection:
Use this class whenever you want to create and throw errors with HTTP status codes (like throw new AppError('Not Found', 404)).

Helps to differentiate between different types of errors and send proper HTTP responses.

In your global error handling middleware, you check for instances of AppError to customize the response.

Promotes clean, maintainable, and semantic error handling throughout your Express app.
 */