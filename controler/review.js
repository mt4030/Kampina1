// Import the Campground and Review Mongoose models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Exported function to handle POST requests for creating a new review
module.exports.create = async (req, res) => {
  // First, find the campground by its ID (from the route param)
  const campground = await Campground.findById(req.params.id);

  // Create a new review instance using data sent from the review form (req.body.review)
  // Make sure in your form, the input names are like: name="review[body]" or name="review[rating]"
  const review = await new Review(req.body.review);

  // Add the review to the campground's reviews array
  // This links the review to the campground
  campground.reviews.push(review);

  // Set the author of the review to the currently logged-in user
  // 'req.user._id' is available through Passport (make sure user is authenticated)
  review.author = req.user._id;

  // Save the new review document to the Review collection
  await review.save();

  // Save the updated campground document with the new review added
  await campground.save();

  // Flash a success message to the user (requires connect-flash middleware)
  req.flash('success', 'posted the review');

  // Redirect back to the campground's show page
  res.redirect(`/campgrounds/${campground._id}`);
};

// Exported function to handle DELETE requests for deleting a review
module.exports.delete = async (req, res) => {
  // Destructure campground id and review id from route params
  const { id, reviewId } = req.params;

  // First, remove the review reference from the campground's 'reviews' array
  // $pull in MongoDB removes elements from an array that match a condition
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Then delete the actual review document from the Review collection
  await Review.findByIdAndDelete(reviewId);

  // Flash a success message to the user
  req.flash('success', 'you deleted a comment!');

  // Redirect back to the campground's show page
  res.redirect(`/campgrounds/${id}`);
};


/**
 Production Notes:
These controller functions (create, delete) are used in routes to separate logic from route handling.

Example Routes:
In routes/reviews.js (or similar):


const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams needed to access :id from parent route
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, reviews.create); // POST /campgrounds/:id/reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.delete); // DELETE /campgrounds/:id/reviews/:reviewId
These routes are typically nested under /campgrounds/:id/reviews, and mounted in app.js:


const reviewRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewRoutes);
You must have the Review model schema properly referencing the Campground and User models.

req.user is available only if you're using Passport.js and the user is authenticated.

req.flash() requires middleware like connect-flash and express-session to work.
 */