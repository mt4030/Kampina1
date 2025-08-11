const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Shortcut to mongoose.Schema

// Define the Review schema
const reviewSchema = new Schema({
  body: String,          // Text content of the review
  rating: Number,        // Numeric rating (e.g., 1-5 stars)

  // Reference to the User who wrote the review
  author: {
    type: Schema.Types.ObjectId, // Stores ObjectId referencing a User document
    ref: 'User'                  // Reference to the User model for population
  }
});

// Export the Review model to use in controllers and routes
module.exports = mongoose.model('Review', reviewSchema);


/**
 🏭 Production Usage and Connections:
This schema stores reviews made by users for campgrounds.

Each review has:

A text body explaining the user’s opinion

A rating number representing their score

An author reference linking to the User who wrote it

This model is referenced in Campground documents to associate reviews with campgrounds.

Supports population to get author details when rendering reviews.

Used in review-related controllers (creating, deleting, updating reviews) and routes.

Works alongside User and Campground models to build relationships between users, campgrounds, and reviews.
 */