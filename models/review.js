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


