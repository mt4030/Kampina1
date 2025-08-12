// Import the User model (Mongoose schema with passport-local-mongoose plugin)
const User = require('../models/User');

// Render the registration form
// Route: GET /register
module.exports.singform = (req, res) => {
  res.render('user/register'); // Render the EJS template for user signup form
};

// Handle user signup form submission
// Route: POST /register
module.exports.singup = async (req, res) => {
  try {
    // Destructure user input from the request body
    const { email, username, password } = req.body;

    // Create a new User instance without the password (hashed separately)
    const newuser = new User({ email, username });

    // Register the new user with password hashing and saving (passport-local-mongoose method)
    const registereduser = await User.register(newuser, password);

    // Log the user in immediately after registration (establish session)
    req.login(registereduser, function (err) {
      if (err) {
        return next(err); // Pass error to Express error handler middleware if login fails
      }
      req.flash('success', 'weelcome to campina!'); // Flash success message
      res.redirect('/campgrounds'); // Redirect to campgrounds index page after successful signup and login
    });
  } catch (e) {
    // If error occurs during registration (e.g., duplicate username), flash error message
    req.flash('error', e.message);
    res.redirect('/register'); // Redirect back to signup form for retry
  }
};

// Render the login form
// Route: GET /login
module.exports.loginform = (req, res) => {
  res.render('user/login'); // Render EJS template for user login form
};

// Handle login form submission (usually handled by Passport middleware first)
// Route: POST /login
module.exports.login = (req, res) => {
  req.flash('success', 'welcome back'); // Flash welcome message after successful login

  // Redirect user to the originally requested page (stored in session) or fallback to /campgrounds
  const redirectUrl = req.session.returnTo || '/campgrounds';

  // Clear the stored URL from session to prevent redirect loops
  delete req.session.returnTo;

  res.redirect(redirectUrl); // Redirect user to desired location after login
};

// Handle user logout
// Route: GET or POST /logout (depending on your route setup)
module.exports.logout = (req, res, next) => {
  // Passport's logout method removes user session
  req.logout(function (err) {
    if (err) {
      return next(err); // Pass errors to Express error handler
    }
    req.flash('success', 'Goodbye!'); // Flash goodbye message on logout
    res.redirect('/campgrounds'); // Redirect to main page after logout
  });
};



