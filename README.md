# Netflix Movies - Web Application

A Netflix-style movie web application built with HTML, CSS, and JavaScript using The Movie Database (TMDB) API.

## 📁 Project Structure

```
netflix-movies/
├── config.js          # API configuration and settings
├── register.html      # User registration page
├── login.html         # User login page
├── dashboard.html     # Main movie dashboard
├── style.css          # All styling (Netflix dark theme)
├── script.js          # All JavaScript functionality
└── README.md          # This file
```

## 🚀 Features

### Authentication (Frontend)
- ✅ User registration with name, email, and password
- ✅ User login with email and password validation
- ✅ Users stored in browser localStorage
- ✅ Protected dashboard (redirects if not logged in)
- ✅ Logout functionality
- ✅ Session persistence

### Movie Dashboard
- ✅ Fetches movies from TMDB API
- ✅ Multiple categories:
  - 🔥 Trending
  - ⭐ Popular
  - 🏆 Top Rated
  - 💪 Action
  - 😂 Comedy
- ✅ Netflix-style dark UI
- ✅ Movie poster grid layout
- ✅ Hover animations (scale effect)
- ✅ Movie title and rating display
- ✅ Movie details popup modal

### Extra Features
- ✅ Search movies by title
- ✅ Loading spinner
- ✅ Error handling with user-friendly messages
- ✅ Responsive design (mobile-friendly)
- ✅ Smooth animations

## 🛠️ Setup Instructions

### Step 1: Get TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Generate an API key (it's free for personal use)
5. Copy your API key

### Step 2: Configure API Key

Open `config.js` and replace the API key:

```javascript
const CONFIG = {
    // Replace with your own TMDB API key
    API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
    // ... rest of config
};
```

### Step 3: Run the Application

#### Option A: Using VS Code Live Server (Recommended)

1. Open the project folder in VS Code
2. Install the "Live Server" extension
3. Right-click on `login.html` and select "Open with Live Server"

#### Option B: Using Python Simple HTTP Server

1. Open terminal in the project directory
2. Run: `python -m http.server 8000`
3. Open browser: `http://localhost:8000/login.html`

#### Option C: Using VSCode's Simple Browser

1. Press `F1` in VS Code
2. Type "Simple Browser" and select it
3. Navigate to `http://localhost:5500/login.html` (or whatever port your live server uses)

## 📖 How to Use

### 1. Registration
- Open `register.html` in your browser
- Fill in your name, email, and password
- Click "Sign Up"
- You'll be redirected to login page

### 2. Login
- Open `login.html`
- Enter your registered email and password
- Click "Sign In"
- You'll be redirected to the movie dashboard

### 3. Browse Movies
- The dashboard loads automatically with 5 movie categories
- Scroll horizontally to see more movies in each category
- Hover over movie cards for animation effect

### 4. View Movie Details
- Click on any movie card to open the details modal
- View movie title, rating, year, runtime, genres, and overview

### 5. Search Movies
- Use the search bar in the navigation
- Type a movie name and press Enter or click the search button
- View search results in a dedicated section

### 6. Logout
- Click the "Logout" button in the navigation
- You'll be redirected to the login page

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables, flexbox, and grid
- **JavaScript (ES6+)** - Modern JS with classes, async/await, arrow functions
- **Fetch API** - For API requests
- **localStorage** - For user data persistence

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### API Endpoints Used
- `/trending/movie/week` - Trending movies
- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/discover/movie?with_genres=28` - Action movies
- `/discover/movie?with_genres=35` - Comedy movies
- `/search/movie` - Search movies
- `/movie/{id}` - Movie details

## ⚠️ Important Notes

1. **API Key Required**: The app will show an error if no valid TMDB API key is configured
2. **Local Storage**: Users are stored in your browser's localStorage (not a real database)
3. **Security**: This is a frontend-only demo. Don't use this for production authentication
4. **Rate Limits**: TMDB has API rate limits. If you hit them, wait a bit and try again

## 📝 File Descriptions

### config.js
Contains API configuration, base URLs, and image size settings. Replace the API key with your own.

### register.html
Registration form with validation for name, email, password, and confirm password fields.

### login.html
Login form with email and password validation. Redirects to dashboard on success.

### dashboard.html
Main page with navigation bar, movie categories grid, search functionality, and movie details modal.

### style.css
Complete Netflix-style dark theme with:
- CSS variables for easy theming
- Responsive grid layouts
- Smooth animations and transitions
- Modal styling
- Custom scrollbars

### script.js
Main JavaScript with:
- `AuthManager` class - handles user registration, login, logout
- `TMDBManager` class - handles all API calls
- `UIManager` class - handles UI updates
- `ModalManager` class - handles movie details modal
- Page initialization based on current URL

## 🎨 Design Highlights

- Dark Netflix-inspired theme (#141414 background)
- Red accent color (#e50914)
- Smooth hover animations on movie cards
- Gradient overlays on cards
- Backdrop blur on modals
- Custom scrollbars
- Fully responsive for mobile devices

## 📄 License

This project is for educational purposes. Movie data is provided by [TMDB](https://www.themoviedb.org/).

---

**Enjoy your Netflix-style movie app! 🎬🍿**
