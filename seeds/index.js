// Import Mongoose for DB operations
const mongoose = require('mongoose');

// Import file system and path modules to read JSON data file
const fs = require('fs');
const path = require('path');

// Read and parse a JSON file named 'iran.json' that contains an array of cities (with coordinates and admin names)
const citiesRaw = fs.readFileSync(path.join(__dirname, 'iran.json'), 'utf-8');
const cities = JSON.parse(citiesRaw);

// Import arrays 'places' and 'descriptors' from a local file 'seedHelpers.js' to generate campground names
const { places, descriptors } = require('./seedHelpers');

// Import the Campground Mongoose model/schema to create documents in MongoDB
const Campground = require('../models/campground');

// Connect to MongoDB database 'Kampina' running locally
main().catch(err => console.log(err)); // Log any connection errors
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Kampina');
  console.log('connn1nected to mongo'); // Confirmation of successful connection
}

// Helper function that returns a random element from an array, used to pick random places and descriptors
const sample = array => array[Math.floor(Math.random() * array.length)];

// Main async function that seeds the database with campgrounds
const seedDB = async () => {
  // Remove all existing campgrounds from the collection to start fresh
  await Campground.deleteMany({});

  // Loop to create 20 new campground documents with random data
  for (let i = 0; i < 7; i++) {
    // Pick a random city from the 'cities' array
    const random1000 = Math.floor(Math.random() * cities.length);

    // Generate a random price between 1 and 999 for the campground
    const price = Math.floor(Math.random() * 999) + 1;

    // Create a new Campground document with:
    const camp = new Campground({
      // Hardcoded author ID for all seeded campgrounds (replace with real user ID in production)
      author: new mongoose.Types.ObjectId('687e32b20b8abc9582565752'),

      // Location string combining city and province
      location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
      // Store admin_name separately for easier access or filtering
      admin_name: cities[random1000].admin_name,

      // Generate a random title using one descriptor and one place (e.g. "Silent Canyon")
      title: `${sample(descriptors)}, ${sample(places)}`,

      // Add two static image URLs as placeholders
      images:  [
        {
          url: 'https://res.cloudinary.com/dojpvy8t7/image/upload/v1753715710/fseiebd2kuzqimq16x2t.jpg',
          filename: 'fseiebd2kuzqimq16x2t'
        },
        {
          url: 'https://res.cloudinary.com/dojpvy8t7/image/upload/v1753715712/iqtfuzizvlq72iq9kkem.jpg',
          filename: 'iqtfuzizvlq72iq9kkem'
        }
      ],

      // Simple placeholder description text
      description: 'i love it hate it at same time',

      // Randomly assigned price
      price: price,

      // GeoJSON geometry object with 'Point' type and coordinates [longitude, latitude]
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(cities[random1000].lng),
          parseFloat(cities[random1000].lat)
        ]
      }
    });

    // Save the new campground document to MongoDB
    await camp.save();
    // Log the location of the saved campground
    console.log(`Saved: ${camp.location}`);
  }
};

// Run the seed function, then close the MongoDB connection cleanly
seedDB().then(() => {
  mongoose.connection.close();
});


