// Import Joi, a powerful schema description and data validation library
const Joi = require('joi');

// Import sanitize-html to clean user input from potentially dangerous HTML
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
  type: 'string', // Extends only Joi strings
  base: joi.string(), // Base type is string
  messages: {
    // Custom error message for when HTML is found
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    // Define the custom rule
    escapeHTML: {
      validate(value, helpers) {
        // Sanitize the string by stripping all tags and attributes
        const clean = sanitizeHtml(value, {
          allowedTags: [], // Disallow all HTML tags
          allowedAttributes: {} // Disallow all attributes
        });
        // If the sanitized value is different from the original, reject it
        if (clean !== value) {
          return helpers.error('string.escapeHTML', { value });
        }
        return clean; // Return the sanitized value
      }
    }
  }
});


const customJoi = Joi.extend(extension);

module.exports.campgroundSchema = customJoi.object({
  campground: customJoi.object({
    title: customJoi.string().required().trim().escapeHTML(),
    price: customJoi.number().min(0).required(), // Must be a number and >= 0
    location: customJoi.string().required().trim().escapeHTML(),
    description: customJoi.string().required().trim().escapeHTML()
  }).required(),

  // Optional array of image IDs to be deleted
  deleteimage: customJoi.array()
});


module.exports.reviewSchema = customJoi.object({
  review: customJoi.object({
    rating: customJoi.number().min(1).max(5).required(),
    body: customJoi.string().required().trim().escapeHTML()
  }).required()
});


