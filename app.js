// Load environment variables from .env file (only in development mode)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ======== CORE & THIRD-PARTY MODULES ==========
const express = require('express'); // Web framework
const session = require('express-session'); // For session management
const path = require('path'); // For working with file paths
const methodOverride = require('method-override'); // To support PUT/DELETE in forms
const morgan = require('morgan'); // Logger for HTTP requests
const ejsMate = require('ejs-mate'); // To support layout/partials in EJS templates
const AppError = require('./util/AppError'); // Custom error handler class
const campgroundsroute = require('./routes/campgrounds'); // Campgrounds routes (CRUD)
const userroute = require('./routes/user'); // User auth routes (register/login)
const reviewroute = require('./routes/review'); // Reviews routes (nested under campgrounds)
const flash = require('connect-flash'); // Flash messages (for success/error)
const passport = require('passport'); // Authentication library
const localstratgy = require('passport-local'); // Strategy for username/password auth
const user = require('./models/User'); // Mongoose User model
const helmet = require('helmet'); // Adds security headers
const mongoose = require('mongoose');

////////

const MongoStore = require('connect-mongo');

const dbUrl = 'mongodb+srv://mohsent4030:tFSxCjHSU0thO1dl@cluster0.kxdsjj4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' || 'mongodb://localhost:27017/Kampina';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express(); // Create Express app instance


// ========== STATIC FILES ==========
app.use(express.static('public')); // Serve static files like CSS, JS, images

// ========== VIEW ENGINE SETUP ==========
app.engine('ejs', ejsMate); // Use ejsMate for layouts
app.set('view engine', 'ejs'); // Set EJS as templating engine
app.set('views', path.join(__dirname, 'views')); // Views directory


// ========== PARSE REQUEST BODIES ==========
app.use(express.json()); // Parse JSON payloads


const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,  // Note: 'mongoUrl' not 'url'
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
// ========== SESSION SETUP ==========
const sessionConfig = {
    store,
  name: 'lospopos', // Session cookie name (custom)
  secret, // Secret key for signing session ID cookie
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Expires in 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
  }
};





app.use(session(sessionConfig)); // Register session middleware

// ========== FLASH MESSAGES ==========
app.use(flash()); // Register flash middleware

// ========== SECURITY HEADERS ==========
app.use(helmet({ contentSecurityPolicy: false })); // Helmet adds security headers (CSP off here)

// ========== PASSPORT SETUP ==========
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use sessions with passport

// Configure passport to use local strategy and our user model
passport.use(new localstratgy(user.authenticate()));
// Serialize and deserialize user to/from session (required by passport)
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());







// ========== FLASH LOCALS MIDDLEWARE ==========
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // Attach current user to locals
  res.locals.success = req.flash('success'); // Flash success messages
  res.locals.error = req.flash('error'); // Flash error messages

  next();
});



// ========== MIDDLEWARE ==========
app.use(methodOverride('_method')); // Support for PUT/DELETE using query param (?_method)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data


// ========== LOGGING ==========
app.use(morgan('tiny')); // Log request info to console

// ========== ROUTES ==========
// ========== HOME ROUTE ==========
app.get('/', (req, res) => {
  res.render('campgrounds/home'); // Render homepage from EJS template
});

app.use('/campgrounds', campgroundsroute); // Mount campground routes
app.use('/campgrounds/:id/reviews', reviewroute); // Nested reviews route
app.use('/', userroute); // Mount user routes (register, login, logout)

// ========== ERROR HANDLING ==========
app.use((req, res, next) => {
  next(new AppError('Page not found', 404)); // Catch all unhandled routes
});

// Global error handler (renders error.ejs view)
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).render('error', { 
    err,
    env: process.env.NODE_ENV // Pass the env to EJS
  });
});




// ========== START SERVER ==========
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('🌐 Serving on port 8080'); // Confirm server is running
});








