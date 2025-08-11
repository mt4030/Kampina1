// Import Express and create a router instance.
// `mergeParams: true` allows this router to access route parameters from parent routes (if mounted with them).
const express = require('express'); 
const router = express.Router({ mergeParams: true });

// Import the user controller where all logic for user authentication is handled (signup, login, logout).
usercontroler = require('../controler/user');

// Import error-handling utility to wrap async functions and catch errors automatically.
const chatcerror = require('../util/catchAsinc');

// Import passport to handle local strategy authentication (username + password).
const passport = require('passport');

// ---------------------- SIGN UP ROUTE ----------------------

// Mount a route handler for GET and POST requests at "/register"
// GET: Renders the registration form (e.g., a sign-up page).
// POST: Processes the submitted registration form, creating a new user in the database.
router.route('/register')
  .get(usercontroler.singform)                        // Shows signup form
  .post(chatcerror(usercontroler.singup))             // Handles signup logic, wrapped with catchAsync

// ---------------------- LOGIN ROUTE ----------------------

// Mount a route handler for GET and POST requests at "/login"
// GET: Renders the login form.
// POST: Uses Passport's local strategy to authenticate the user.
//       If authentication fails, it redirects to /login and flashes an error.
//       If successful, proceeds to `usercontroler.login` (e.g., redirects or flashes welcome).
router.route('/login')
  .get(usercontroler.loginform)                       // Shows login form
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',                      // Where to go if login fails
      failureFlash: true                              // Flash a failure message (requires connect-flash)
    }),
    usercontroler.login                               // Runs if login succeeds (e.g., redirect user, set session)
  );

// ---------------------- LOGOUT ROUTE ----------------------

// Logs the user out (by destroying their session or calling `req.logout()`) and redirects somewhere (e.g., home).
router.get('/logout', usercontroler.logout);

// Export the router so it can be used in the main app.js (probably mounted at `/`).
module.exports = router;
