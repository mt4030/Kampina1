// Import the Cloudinary v2 SDK for uploading and managing media in the cloud
const cloudinary = require('cloudinary').v2;

// Load environment variables from .env file for sensitive credentials
require('dotenv').config();

// Import CloudinaryStorage class to integrate Cloudinary with multer for file uploads
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with credentials stored in environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // API secret (keep this private)
});

// Configure multer storage engine to upload files directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,            // Use the configured cloudinary instance
  folder: 'campgrounds',             // Optional: specific folder in Cloudinary to store uploads
  allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Limit allowed image formats
});

// Export the configured Cloudinary instance and multer storage for use in routes/middleware
module.exports = {
  cloudinary,
  storage
};
