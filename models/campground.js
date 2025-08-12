const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Shortcut to mongoose.Schema
const Review = require('./review'); // Import Review model to delete related reviews on campground deletion

// Define the Campground schema
const campgroundSchema = new Schema({
  // Array of images, each with a URL and filename (used for displaying images & cloud storage references)
  images: [
    {
      url: String,        // URL to the image (usually stored on Cloudinary or similar)
      filename: String,   // Filename or public ID from cloud storage
    }
  ],

  // GeoJSON object for location (used for mapping and geospatial queries)
  geometry: {
    type: {
      type: String,
      enum: ['Point'],    // Must be 'Point' for GeoJSON
      required: true
    },
    coordinates: {
      type: [Number],     // Array of numbers: [longitude, latitude]
      required: true
    }
  },

  // Basic campground fields
  title: String,          // Name/title of the campground
  price: Number,          // Price per night or visit
  description: String,    // Description text
  location: String,       // Human-readable location string (e.g., city name)

  // Array of references to Review documents (stores ObjectIds referencing Review collection)
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'         // Tells Mongoose to populate this field with Review documents when requested
  }],

  // Reference to User who created the campground
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'           // Reference to User collection for author information
  }
});


// Mongoose middleware (hook) triggered after a document is deleted via findOneAndDelete
// It deletes all reviews whose IDs are in the deleted campground's reviews array,
// ensuring no orphaned reviews remain in the database.
campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    });
  }
});

// Export the Campground model to use in controllers and routes
module.exports = mongoose.model('Campground', campgroundSchema);


