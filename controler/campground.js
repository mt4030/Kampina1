// Import the Campground model from Mongoose schema
const Campground = require('../models/campground');

// Import a custom error class used for app-specific errors
const AppError = require('../util/AppError');

// Cloudinary helper to delete images from cloud storage
const { cloudinary } = require('../util/cloudinary');

// Node.js module to make HTTP requests (used for geocoding)
const fetch = require('node-fetch');



module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}); // Fetch all campgrounds from DB
  res.render('campgrounds/index', { campgrounds }); // Render EJS view and pass data
};



module.exports.rendernewform = (req, res) => {
  res.render('campgrounds/new'); // Show form for creating a new campground
};



module.exports.creatingnew = async (req, res) => {
  try {
    const campground = new Campground(req.body.campground); 
    campground.author = req.user._id; 


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



module.exports.editform = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Fetch campground by ID
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds'); // Redirect to index if not found
  }
  res.render('campgrounds/edit', { campground }); // Render edit form with current data
};



module.exports.edit = async (req, res) => {
 
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    { ...req.body.campground } 
  );

  if (!campground) throw new AppError('Update failed: Campground not found', 404);


  const imags = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }));
  campground.images.push(...imags);
  await campground.save();


  if (req.body.deleteimage) {
    for (let filename of req.body.deleteimage) {
      await cloudinary.uploader.destroy(filename);
    }


    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteimage } } }
    });
  }

  req.flash('success', 'Successfully edited campground!');
  res.redirect(`/campgrounds/${campground._id}`); 
};



module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id); 
  res.redirect('/campgrounds'); 
};


module.exports.show = async (req, res) => {
  const { id } = req.params;

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

  res.render('campgrounds/show', { campground, currentUser: req.user });
};
