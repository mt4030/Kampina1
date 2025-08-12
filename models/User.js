const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); // Plugin for easy username/password management with Passport

// Define the User schema
const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,   // Email is mandatory for each user
    unique: true      // Email must be unique across users
  }
});

// Add passport-local-mongoose plugin to the schema
// This automatically adds username, hash, salt fields
// and also adds convenient methods for password hashing, authentication, etc.
userschema.plugin(passportLocalMongoose);

// Export the User model for use in authentication and user management
module.exports = mongoose.model('User', userschema);

