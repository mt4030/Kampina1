
# Kampina - Campground Explorer 🏕️

A full-stack web application for discovering and sharing campgrounds across Iran. Built with Node.js, Express, MongoDB, and featuring interactive maps and user authentication.

## 🌟 Features

- **Interactive Map**: Explore campgrounds on a cluster map using Leaflet.js
- **User Authentication**: Secure registration and login system with Passport.js
- **CRUD Operations**: Create, read, update, and delete campgrounds
- **Reviews System**: Users can leave reviews and ratings for campgrounds
- **Image Uploads**: Upload multiple images for campgrounds using Cloudinary
- **Responsive Design**: Mobile-friendly interface with Bootstrap
- **Security**: Helmet.js for security headers, data sanitization, and session management
- **Flash Messages**: User feedback for actions and errors

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **Helmet.js** - Security middleware

### Frontend
- **EJS** - Templating engine with layouts
- **Bootstrap 5** - CSS framework
- **Leaflet.js** - Interactive maps
- **Vanilla JavaScript** - Client-side functionality

### Cloud Services
- **Cloudinary** - Image storage and optimization
- **MongoDB Atlas** - Cloud database

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kampina
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   SECRET=your-session-secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the app**
   Open your browser and navigate to `http://localhost:5000`

## 🗂️ Project Structure

```
kampina/
├── controler/          # Route controllers
│   ├── campground.js   # Campground CRUD operations
│   ├── review.js       # Review operations
│   └── user.js         # Authentication logic
├── models/             # Mongoose schemas
│   ├── campground.js   # Campground model
│   ├── review.js       # Review model
│   └── User.js         # User model
├── routes/             # Express routes
│   ├── campgrounds.js  # Campground routes
│   ├── review.js       # Review routes
│   └── user.js         # Auth routes
├── views/              # EJS templates
│   ├── campgrounds/    # Campground pages
│   ├── user/           # Auth pages
│   └── layout/         # Layout templates
├── public/             # Static assets
├── static-demo/        # Demo version
├── seeds/              # Database seeding
└── util/               # Utilities
```

## 🚀 Features Overview

### Campground Management
- Browse all campgrounds with pagination
- View detailed campground information
- Add new campgrounds with multiple images
- Edit and delete your own campgrounds
- Interactive map showing campground locations

### User System
- User registration and login
- Session-based authentication
- Authorization (only authors can edit/delete their content)
- User profile management

### Reviews & Ratings
- Leave reviews for campgrounds
- Star rating system
- Only logged-in users can review
- Users can delete their own reviews

### Map Integration
- Interactive cluster map on homepage
- Individual campground markers
- GeoJSON support for location data
- Responsive map design

## 🔒 Security Features

- **Helmet.js** - Sets various HTTP headers
- **Express Mongo Sanitize** - Prevents NoSQL injection
- **Data Validation** - Joi schema validation
- **Session Security** - Secure session configuration
- **Authentication** - Passport.js local strategy

## 📱 Demo

A static demo version is available in the `static-demo/` directory showcasing the frontend design and functionality without backend dependencies.

## 🌐 Deployment

unfortunately i couldn't deploy it as it required me to pay but i just built it to showcase it 

## 👤 Author

**[mohsen]**
 

## 🙏 Acknowledgments

- Campground data and images from various sources
- Bootstrap for responsive design
- Leaflet.js community for mapping solutions
- The Node.js and Express.js communities

---

