const Campground = require('./models/campground'); // Campground mongoose model
const Review = require('./models/review');         // Review mongoose model
const { reviewSchema, campgroundSchema } = require('./schemas'); // Joi validation schemas
const AppError = require('./util/AppError');       // Custom error class for app-specific errors

// Middleware to check if user is authenticated (logged in)
module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) { // Passport method to check login status
    req.session.returnTo = req.originalUrl; // Save requested URL to redirect after login
    req.flash('error', 'you must log in to create campground'); // Flash message for user feedback
    return res.redirect('/login'); // Redirect to login page if not authenticated
  }
  next(); // User logged in → proceed to next middleware or route handler
};

// Middleware to check if current user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params; // Get campground ID from URL params

  const campground = await Campground.findById(id); // Find campground by ID from DB
  
  if (!campground) {
    req.flash('error', 'Campground not found'); // Flash error if campground missing
    return res.redirect('/campground');         // Redirect to campgrounds list
  }

  // Check if logged-in user is the author of the campground
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that'); // Flash permission error
    return res.redirect(`/campground/${id}`); // Redirect back to campground details
  }

  next(); // User is the author → proceed
};

// Middleware to check if current user is the author of a review
module.exports.isreviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // Get campground and review IDs

  const review = await Review.findById(reviewId); // Find review by ID
  
  if (!review) {
    req.flash('error', 'Campground not found'); // Flash error if review missing (message could be improved)
    return res.redirect('/campground');         // Redirect to campgrounds list
  }

  // Check if logged-in user is the author of the review
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that'); // Flash permission error
    return res.redirect(`/campground/${id}`); // Redirect back to campground details
  }

  next(); // User is the author → proceed
};

// Middleware to validate campground data using Joi schema before creating or updating
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body); // Validate req.body against schema
  if (error) {
    // Throw an AppError with validation message and HTTP 400 Bad Request status
    throw new AppError(error.details[0].message, 400);
  }
  next(); // Validation passed → proceed
};

// Middleware to validate review data using Joi schema before creating
module.exports.validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate req.body against schema
  if (error) {
    // Throw an AppError with validation message and HTTP 400 Bad Request status
    throw new AppError(error.details[0].message, 400);
  }
  next(); // Validation passed → proceed
};

/*
-------How and where these connect in your app / production use:
isloggedin: Use as a gatekeeper middleware on routes that require login, e.g., creating/editing campgrounds or reviews. 
Redirects to login page if user is not authenticated.

isAuthor: Protects campground update/delete routes so only the campground's creator (author) can modify or delete it. 
Prevents unauthorized changes.

isreviewAuthor: Protects review delete routes so only the review's creator can delete their own review.

validateCampground and validatereview: Ensure that data coming from user forms is valid before reaching the database.
 Prevents bad or malicious input by validating with Joi schemas.
 ------Typical route example integration:
router.post('/campgrounds', isloggedin, validateCampground, campgroundsController.creatingnew);
router.patch('/campgrounds/:id', isloggedin, isAuthor, validateCampground, campgroundsController.edit);
router.post('/campgrounds/:id/reviews', isloggedin, validatereview, reviewController.create);
router.delete('/campgrounds/:id/reviews/:reviewId', isloggedin, isreviewAuthor, reviewController.delete);


 */