// Import Express and create a router instance
const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
// mergeParams:true allows this router to access parameters from the parent router (like campgroundId from /campgrounds/:id/reviews)

// Import the async error-catching utility
const chatcerror = require('../util/catchAsinc'); 
// This is a wrapper for async functions to catch any errors and pass them to Express's error handler

// Import middlewares for authentication, authorization, and validation
const { isloggedin, isreviewAuthor, validatereview } = require('../middleware'); 
// - isloggedin: checks if user is logged in
// - isreviewAuthor: checks if current user is the author of the review
// - validatereview: validates the review data using Joi schema

// Import the review controller functions
const reviewControler = require('../controler/review'); 
// This file contains logic to create and delete reviews

// ==================== ROUTES ====================

// Route to create a new review for a campground
router.post(
  '/', 
  isloggedin,               // User must be logged in
  validatereview,           // Validate review input
  chatcerror(reviewControler.create) // Controller function wrapped to catch async errors
);

// Route to delete a specific review
router.delete(
  '/:reviewId', 
  isloggedin,               // User must be logged in
  isreviewAuthor,           // User must be the review author
  chatcerror(reviewControler.delete) // Controller function wrapped to catch async errors
);

// Export the router so it can be used in the main app
module.exports = router;
