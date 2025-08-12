const Campground = require('./models/campground'); 
const Review = require('./models/review');        
const { reviewSchema, campgroundSchema } = require('./schemas'); 
const AppError = require('./util/AppError');    

// Middleware to check if user is authenticated (logged in)
module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) { // Passport method to check login status
    req.session.returnTo = req.originalUrl; // Save requested URL to redirect after login
    req.flash('error', 'you must log in to create campground'); // Flash message for user feedback
    return res.redirect('/login'); // Redirect to login page if not authenticated
  }
  next();
};

// Middleware to check if current user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params; // Get campground ID from URL params

  const campground = await Campground.findById(id); // Find campground by ID from DB
  
  if (!campground) {
    req.flash('error', 'Campground not found'); // Flash error if campground missing
    return res.redirect('/campground');         // Redirect to campgrounds list
  }


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

