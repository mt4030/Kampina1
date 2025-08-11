// Import the Campground model from Mongoose schema
const Campground = require('../models/campground');

// Import a custom error class used for app-specific errors
const AppError = require('../util/AppError');

// Cloudinary helper to delete images from cloud storage
const { cloudinary } = require('../util/cloudinary');

// Node.js module to make HTTP requests (used for geocoding)
const fetch = require('node-fetch');


// ==========================
// GET /campgrounds
// Show all campgrounds on index page
// In production: used to display list of campgrounds to any visitor
// Connected to: campgrounds/index.ejs view, Campground model for DB
// ==========================
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}); // Fetch all campgrounds from DB
  res.render('campgrounds/index', { campgrounds }); // Render EJS view and pass data
};


// ==========================
// GET /campgrounds/new
// Render form to create new campground
// Protected route (usually only for authenticated users)
// In production: used to show a form for users to add new campground info
// Connected to: campgrounds/new.ejs view
// ==========================
module.exports.rendernewform = (req, res) => {
  res.render('campgrounds/new'); // Show form for creating a new campground
};


// ==========================
// POST /campgrounds
// Handle form submission to create a new campground
// Handles file upload and geocoding (getting coordinates from location)
// In production: process form data, store new campground in DB, save images, geocode location
// Connected to: form in campgrounds/new.ejs, Campground model, Cloudinary for images
// ==========================
module.exports.creatingnew = async (req, res) => {
  try {
    const campground = new Campground(req.body.campground); // Create new campground object from form input
    campground.author = req.user._id; // Attach currently logged-in user as author

    // === Geocode location using OpenStreetMap API ===
    const locationQuery = req.body.campground.location;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
    const data = await response.json();

    if (data.length > 0) {
      campground.geometry = {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
      };
    } else {
      campground.geometry = {
        type: "Point",
        coordinates: [0, 0] // fallback if geocoding fails
      };
    }

    // === Save uploaded images ===
    campground.images = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    await campground.save(); // Save to MongoDB
    req.flash('success', 'Successfully created new campground!');
    res.redirect(`/campgrounds/${campground._id}`); // Redirect to detail page of new campground
  } catch (err) {
    console.error(err); // Log any errors for debugging
    req.flash('error', 'Something went wrong!');
    res.redirect('/campgrounds'); // Redirect back to index on failure
  }
};


// ==========================
// GET /campgrounds/:id/edit
// Render edit form for existing campground
// Used when user clicks "Edit" on campground show page
// In production: display form pre-filled with campground data to allow editing
// Connected to: campgrounds/edit.ejs view, Campground model
// ==========================
module.exports.editform = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Fetch campground by ID
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds'); // Redirect to index if not found
  }
  res.render('campgrounds/edit', { campground }); // Render edit form with current data
};


// ==========================
// PUT /campgrounds/:id
// Handle edit form submission and update campground
// Also handles adding and deleting images
// In production: update campground data in DB, upload/delete images in Cloudinary
// Connected to: form submission from campgrounds/edit.ejs, Campground model, cloudinary utility
// ==========================
module.exports.edit = async (req, res) => {
  // Update campground with new data from form
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    { ...req.body.campground } // Spread operator to update multiple fields safely
  );

  if (!campground) throw new AppError('Update failed: Campground not found', 404);

  // === Handle uploaded images (add to existing ones) ===
  const imags = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }));
  campground.images.push(...imags); // Append new images
  await campground.save();

  // === Handle image deletion ===
  if (req.body.deleteimage) {
    for (let filename of req.body.deleteimage) {
      await cloudinary.uploader.destroy(filename); // Delete image from Cloudinary
    }

    // Remove image entries from campground in DB
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteimage } } }
    });
  }

  req.flash('success', 'Successfully edited campground!');
  res.redirect(`/campgrounds/${campground._id}`); // Redirect to updated campground detail page
};


// ==========================
// DELETE /campgrounds/:id
// Remove campground from DB
// Triggered when user clicks "Delete" on show/edit page
// In production: deletes the campground and associated images (handled elsewhere)
// Connected to: Campground model
// ==========================
module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id); // Delete campground by ID
  res.redirect('/campgrounds'); // Redirect to campgrounds list after deletion
};


// ==========================
// GET /campgrounds/:id
// Show detailed view of a single campground
// Populates reviews and author for display
// In production: display details, reviews, author info on show page
// Connected to: campgrounds/show.ejs view, Campground and Review models
// ==========================
module.exports.show = async (req, res) => {
  const { id } = req.params;

  // Populate reviews and their authors, plus the campground author
  const campground = await Campground.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('author');

  if (!campground) {
    req.flash('error', 'couldn’t find campground');
    return res.redirect('/campgrounds'); // Redirect to index if not found
  }

  // Render detailed campground page, pass current user for conditional logic in templates
  res.render('campgrounds/show', { campground, currentUser: req.user });
};
