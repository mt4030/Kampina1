const express = require('express'); // Main web framework
const router=express.Router({mergeParams:true})
const chatcerror = require('../util/catchAsinc');
const campgroundsControler=require('../controler/campground')
const{isloggedin ,isAuthor,validateCampground }=require('../middleware')

const{storage}=require('../util/cloudinary/index');
const multer = require('multer');

const upload=multer({storage})

// ========== ROUTES ==========

router.route('/')
// Show all campgrounds (INDEX route)
.get( chatcerror(campgroundsControler.index))
// Handle creation of new campground (CREATE route)
.post( isloggedin,upload.array("image"),validateCampground, chatcerror(campgroundsControler.creatingnew));


// Show form to create a new campground
router.get('/new',isloggedin, campgroundsControler.rendernewform);


// Show form to edit a specific campground (EDIT route)
router.get('/:id/edit', isloggedin,isAuthor,chatcerror(campgroundsControler.editform));


router.route('/:id')
// Handle campground update (UPDATE route)
.patch( isloggedin,isAuthor,upload.array("image"),validateCampground, chatcerror(campgroundsControler.edit))
// Handle deletion of a campground (DELETE route)
.delete( isloggedin ,isAuthor,chatcerror(campgroundsControler.delete))
// Show details of a single campground (SHOW route)
.get( chatcerror(campgroundsControler.show));


module.exports= router