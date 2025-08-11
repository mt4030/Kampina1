// Export a higher-order function that wraps an async route handler to catch errors
module.exports = funcy => {
  // Return a new middleware function
  return (req, res, next) => {
    // Call the original async function (funcy) with req, res, next
    // If it throws/rejects, catch the error and pass it to next() middleware (error handler)
    funcy(req, res, next).catch(next);
  };
};
/**
 Explanation & Production Usage:
This is an async error catcher wrapper often called catchAsync or catchError.

It’s used to wrap async Express route handlers to avoid repetitive try/catch blocks.

When an async route throws an error or rejects a promise, it ensures the error is passed to Express’s error handling middleware.

Usage example in routes:
const catchAsync = require('./utils/catchAsync');

router.get('/', catchAsync(async (req, res) => {
  // Your async code here
}));

 */