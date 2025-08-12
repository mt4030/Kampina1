// Export a higher-order function that wraps an async route handler to catch errors
module.exports = funcy => {
  // Return a new middleware function
  return (req, res, next) => {
    // Call the original async function (funcy) with req, res, next
    // If it throws/rejects, catch the error and pass it to next() middleware (error handler)
    funcy(req, res, next).catch(next);
  };
};
