// Import Joi, a powerful schema description and data validation library
const Joi = require('joi');

// Import sanitize-html to clean user input from potentially dangerous HTML
const sanitizeHtml = require('sanitize-html');

/**
 * ✅ Custom Joi extension to sanitize all string inputs
 * This adds a new rule `.escapeHTML()` to Joi strings,
 * which will clean out all HTML tags and attributes using sanitize-html.
 */
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

/**
 * ✅ Extend Joi with the custom escapeHTML rule
 * From now on, we can use `.escapeHTML()` on any Joi string.
 */
const customJoi = Joi.extend(extension);

/**
 * ✅ campgroundSchema
 * This schema is used to validate the data submitted when creating or updating a campground.
 * It ensures that title, price, location, and description exist and are safe from HTML injection.
 * 
 * Used in production inside a middleware function like `validateCampground(req, res, next)`
 * before the route handler. This middleware is typically added to POST and PUT/PATCH routes.
 */
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

/**
 * ✅ reviewSchema
 * This schema validates user reviews for a campground.
 * Makes sure rating is between 1 and 5, and body is sanitized.
 * 
 * Used in production before allowing review POST requests,
 * typically in a middleware like `validateReview(req, res, next)`
 * for routes like POST `/campgrounds/:id/reviews`.
 */
module.exports.reviewSchema = customJoi.object({
  review: customJoi.object({
    rating: customJoi.number().min(1).max(5).required(),
    body: customJoi.string().required().trim().escapeHTML()
  }).required()
});


/**
 🧠 Where and When You Use This in Production:
Location in App:

Typically imported into a middleware file (like middleware/index.js).

Middleware functions use these schemas to validate user input from req.body.

Used In Routes Like:

POST /campgrounds

PATCH /campgrounds/:id

POST /campgrounds/:id/reviews

Purpose:

Prevent users from injecting scripts or HTML via form input.

Protects against XSS (Cross Site Scripting) attacks.

Ensures data integrity (e.g. price is a number, title is not empty, etc).
 */