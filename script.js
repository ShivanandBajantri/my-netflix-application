/**
 * Netflix Movies - Script.js
 * Main JavaScript functionality
 */

// ============================================
// AUTHENTICATION MANAGEMENT
// ============================================

/**
 * Authentication Manager Class
 * Handles user registration, login, logout, and session management
 */
class AuthManager {
    constructor() {
        this.USERS_KEY = 'netflix_users';
        this.CURRENT_USER_KEY = 'netflix_current_user';
    }

    /**
     * Get all registered users from localStorage
     * @returns {Array} Array of user objects
     */
    getUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    /**
     * Save users to localStorage
     * @param {Array} users - Array of user objects
     */
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    /**
     * Register a new user
     * @param {string} name - User's full name
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Object} Result with success status and message
     */
    register(name, email, password) {
        // Validate inputs
        if (!name || !email || !password) {
            return { success: false, message: 'All fields are required' };
        }

        // Validate email format
        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Invalid email format' };
        }

        // Validate password length
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Check if user already exists
        const users = this.getUsers();
        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: this.hashPassword(password), // Simple hash for demo
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Registration successful! Please login.' };
    }

    /**
     * Login user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Object} Result with success status and user data or message
     */
    login(email, password) {
        // Validate inputs
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        // Find user
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: 'User not found. Please register first.' };
        }

        // Check password (simple comparison for demo)
        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Save current user session (without password)
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionUser));

        return { success: true, message: 'Login successful!', user: sessionUser };
    }

    /**
     * Logout current user
     */
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'login.html';
    }

    /**
     * Get current logged in user
     * @returns {Object|null} Current user object or null
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Check if user is logged in
     * @returns {boolean} True if logged in
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Simple password hashing (for demo purposes)
     * In production, use proper hashing like bcrypt
     * @param {string} password - Plain text password
     * @returns {string} Hashed password
     */
    hashPassword(password) {
        // Simple base64 encoding for demo (NOT secure for production)
        return btoa(password + 'netflix_salt');
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ============================================
// TMDB API MANAGER
// ============================================

/**
 * TMDB API Manager Class
 * Handles all API calls to The Movie Database
 */
class TMDBManager {
    constructor() {
        this.apiKey = CONFIG.API_KEY;
        this.baseUrl = CONFIG.BASE_URL;
        this.imageBaseUrl = CONFIG.IMAGE_BASE_URL;
        this.posterSize = CONFIG.POSTER_SIZES.medium;
        
        // Check if API key is configured
        if (this.apiKey === 'YOUR_TMDB_API_KEY_HERE' || !this.apiKey) {
            console.warn('TMDB API key not configured. Please add your API key in config.js');
        }
    }

    /**
     * Build URL for API requests
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {string} Full URL
     */
    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('api_key', this.apiKey);
        
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        return url.toString();
    }

    /**
     * Get full image URL
     * @param {string} path - Image path from API
     * @param {string} size - Image size
     * @returns {string} Full image URL
     */
    getImageUrl(path, size = 'medium') {
        if (!path) return null;
        const sizeKey = size === 'medium' ? 'medium' : 
                       size === 'large' ? 'large' : 'small';
        return `${this.imageBaseUrl}/${CONFIG.POSTER_SIZES[sizeKey]}${path}`;
    }

    /**
     * Fetch data from API
     * @param {string} url - URL to fetch
     * @returns {Object} Response data
     */
    async fetchData(url) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    /**
     * Get trending movies
     * @returns {Array} Array of trending movies
     */
    async getTrendingMovies() {
        const url = this.buildUrl('/trending/movie/week');
        const data = await this.fetchData(url);
        return data.results || [];
    }

    /**
     * Get popular movies
     * @returns {Array} Array of popular movies
     */
    async getPopularMovies() {
        const url = this.buildUrl('/movie/popular');
        const data = await this.fetchData(url);
        return data.results || [];
    }

    /**
     * Get top rated movies
     * @returns {Array} Array of top rated movies
     */
    async getTopRatedMovies() {
        const url = this.buildUrl('/movie/top_rated');
        const data = await this.fetchData(url);
        return data.results || [];
    }

    /**
     * Get movies by genre (Action - genre_id: 28)
     * @returns {Array} Array of action movies
     */
    async getActionMovies() {
        const url = this.buildUrl('/discover/movie', {
            with_genres: 28,
            sort_by: 'popularity.desc'
        });
        const data = await this.fetchData(url);
        return data.results || [];
    }

    /**
     * Get movies by genre (Comedy - genre_id: 35)
     * @returns {Array} Array of comedy movies
     */
    async getComedyMovies() {
        const url = this.buildUrl('/discover/movie', {
            with_genres: 35,
            sort_by: 'popularity.desc'
        });
        const data = await this.fetchData(url);
        return data.results || [];
    }

    /**
     * Search movies by query
     * @param {string} query - Search query
     * @returns {Array} Array of matching movies
     */
    async searchMovies(query) {
        if (!query.trim()) return [];
        
        const url = this.buildUrl('/search/movie', {
            query: encodeURIComponent(query.trim())
        });
        const data = await this.fetchData(url);
        return data.results || [];
    }

    /**
     * Get movie details by ID
     * @param {number} movieId - Movie ID
     * @returns {Object} Movie details
     */
    async getMovieDetails(movieId) {
        const url = this.buildUrl(`/movie/${movieId}`);
        return await this.fetchData(url);
    }

    /**
     * Get genre names from movie object
     * @param {Array} genreIds - Array of genre IDs
     * @returns {Array} Array of genre names
     */
    getGenreNames(genreIds) {
        // TMDB genre mapping
        const genres = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        };

        return genreIds.map(id => genres[id] || 'Unknown').slice(0, 3);
    }
}

// ============================================
// UI MANAGER
// ============================================

/**
 * UI Manager Class
 * Handles all DOM manipulations and UI updates
 */
class UIManager {
    constructor() {
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.movieContent = document.getElementById('movieContent');
        this.searchResultsTitle = document.getElementById('searchResultsTitle');
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.remove('hidden');
        }
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.querySelector('p').textContent = message;
            this.errorMessage.classList.remove('hidden');
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }
    }

    /**
     * Create movie card HTML element
     * @param {Object} movie - Movie object from API
     * @param {TMDBManager} apiManager - API manager instance
     * @returns {HTMLElement} Movie card element
     */
    createMovieCard(movie, apiManager) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.movieId = movie.id;

        const posterPath = movie.poster_path;
        const imageUrl = posterPath ? apiManager.getImageUrl(posterPath, 'medium') : null;

        card.innerHTML = `
            ${imageUrl 
                ? `<img src="${imageUrl}" alt="${movie.title}" loading="lazy">`
                : `<div class="placeholder">🎬</div>`
            }
            <div class="movie-card-overlay">
                <div class="movie-card-title">${movie.title}</div>
                <div class="movie-card-rating">
                    <span class="star">⭐</span>
                    <span>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        `;

        // Add click event for modal
        card.addEventListener('click', () => {
            showMovieModal(movie.id);
        });

        return card;
    }

    /**
     * Render movies in a container
     * @param {string} containerId - ID of the container element
     * @param {Array} movies - Array of movie objects
     * @param {TMDBManager} apiManager - API manager instance
     */
    renderMovies(containerId, movies, apiManager) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (movies.length === 0) {
            container.innerHTML = '<p class="no-movies">No movies found</p>';
            return;
        }

        movies.forEach(movie => {
            const card = this.createMovieCard(movie, apiManager);
            container.appendChild(card);
        });
    }

    /**
     * Show search results
     * @param {string} query - Search query
     */
    showSearchResults(query) {
        if (this.movieContent) {
            this.movieContent.classList.add('hidden');
        }
        if (this.searchResultsTitle) {
            document.getElementById('searchQuery').textContent = query;
            this.searchResultsTitle.classList.remove('hidden');
        }
    }

    /**
     * Hide search results
     */
    hideSearchResults() {
        if (this.movieContent) {
            this.movieContent.classList.remove('hidden');
        }
        if (this.searchResultsTitle) {
            this.searchResultsTitle.classList.add('hidden');
        }
    }
}

// ============================================
// MODAL MANAGER
// ============================================

/**
 * Modal Manager Class
 * Handles movie details modal
 */
class ModalManager {
    constructor() {
        this.modal = document.getElementById('movieModal');
        this.modalClose = document.getElementById('modalClose');
        this.apiManager = new TMDBManager();
        
        this.setupEventListeners();
    }

    /**
     * Setup modal event listeners
     */
    setupEventListeners() {
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    /**
     * Open modal with movie details
     * @param {number} movieId - Movie ID
     */
    async openModal(movieId) {
        if (!this.modal) return;

        // Show modal with loading state
        this.modal.classList.remove('hidden');
        
        // Reset content
        document.getElementById('modalTitle').textContent = 'Loading...';
        document.getElementById('modalRating').textContent = '⭐ 0.0';
        document.getElementById('modalYear').textContent = '';
        document.getElementById('modalRuntime').textContent = '';
        document.getElementById('modalGenres').innerHTML = '';
        document.getElementById('modalOverview').textContent = 'Loading movie details...';
        document.getElementById('modalPoster').src = '';

        try {
            const movie = await this.apiManager.getMovieDetails(movieId);
            this.updateModalContent(movie);
        } catch (error) {
            console.error('Error loading movie details:', error);
            document.getElementById('modalTitle').textContent = 'Error Loading Details';
            document.getElementById('modalOverview').textContent = 'Failed to load movie details. Please try again.';
        }
    }

    /**
     * Update modal content with movie data
     * @param {Object} movie - Movie details object
     */
    updateModalContent(movie) {
        // Update poster
        const posterPath = movie.poster_path;
        const imageUrl = posterPath ? this.apiManager.getImageUrl(posterPath, 'large') : '';
        document.getElementById('modalPoster').src = imageUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%231f1f1f" width="200" height="300"/><text x="100" y="150" text-anchor="middle" fill="%23666" font-size="50">🎬</text></svg>';

        // Update title
        document.getElementById('modalTitle').textContent = movie.title;

        // Update rating
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        document.getElementById('modalRating').textContent = `⭐ ${rating}`;

        // Update year
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        document.getElementById('modalYear').textContent = year;

        // Update runtime
        const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
        document.getElementById('modalRuntime').textContent = runtime;

        // Update genres
        const genres = movie.genres ? movie.genres.map(g => g.name) : [];
        const genresContainer = document.getElementById('modalGenres');
        genresContainer.innerHTML = genres.map(genre => `<span>${genre}</span>`).join('');

        // Update overview
        document.getElementById('modalOverview').textContent = movie.overview || 'No overview available.';
    }

    /**
     * Close the modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize managers
const authManager = new AuthManager();
const apiManager = new TMDBManager();
const uiManager = new UIManager();
let modalManager = null;

// ============================================
// AUTHENTICATION PAGES
// ============================================

/**
 * Initialize authentication pages (register/login)
 */
function initAuthPage() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // If already logged in, redirect to dashboard
    if (authManager.isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Clear previous errors
            clearErrors();

            // Validate passwords match
            if (password !== confirmPassword) {
                showError('confirmError', 'Passwords do not match');
                return;
            }

            // Attempt registration
            const result = authManager.register(name, email, password);
            
            if (result.success) {
                // Redirect to login page with success message
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                showError('globalError', result.message);
            }
        });
    }

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Clear previous errors
            clearErrors();

            // Attempt login
            const result = authManager.login(email, password);
            
            if (result.success) {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                showError('globalError', result.message);
            }
        });
    }
}

/**
 * Show error message in a specific element
 * @param {string} elementId - ID of error element
 * @param {string} message - Error message
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });
}

// ============================================
// DASHBOARD PAGE
// ============================================

/**
 * Initialize dashboard page
 */
async function initDashboard() {
    // Check if user is logged in
    if (!authManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize modal manager
    modalManager = new ModalManager();

    // Display user name
    const currentUser = authManager.getCurrentUser();
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = `Welcome, ${currentUser.name}`;
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authManager.logout());
    }

    // Setup search functionality
    setupSearch();

    // Load all movie categories
    await loadAllMovies();
}

/**
 * Load all movie categories
 */
async function loadAllMovies() {
    // Check API key
    if (apiManager.apiKey === 'YOUR_TMDB_API_KEY_HERE' || !apiManager.apiKey) {
        uiManager.showError('TMDB API key not configured. Please add your API key in config.js and refresh the page.');
        uiManager.hideLoading();
        return;
    }

    uiManager.showLoading();
    uiManager.hideError();

    try {
        // Fetch all categories in parallel
        const [trending, popular, topRated, action, comedy] = await Promise.all([
            apiManager.getTrendingMovies(),
            apiManager.getPopularMovies(),
            apiManager.getTopRatedMovies(),
            apiManager.getActionMovies(),
            apiManager.getComedyMovies()
        ]);

        // Render all categories
        uiManager.renderMovies('trendingMovies', trending, apiManager);
        uiManager.renderMovies('popularMovies', popular, apiManager);
        uiManager.renderMovies('topRatedMovies', topRated, apiManager);
        uiManager.renderMovies('actionMovies', action, apiManager);
        uiManager.renderMovies('comedyMovies', comedy, apiManager);

        uiManager.hideLoading();
    } catch (error) {
        console.error('Error loading movies:', error);
        uiManager.hideLoading();
        uiManager.showError('Failed to load movies. Please check your internet connection and try again.');
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearch');

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', () => performSearch());
    }

    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Clear search
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            uiManager.hideSearchResults();
            loadAllMovies();
        });
    }
}

/**
 * Perform movie search
 */
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    // Check API key
    if (apiManager.apiKey === 'YOUR_TMDB_API_KEY_HERE' || !apiManager.apiKey) {
        uiManager.showError('TMDB API key not configured. Please add your API key in config.js and refresh the page.');
        return;
    }

    uiManager.showLoading();
    uiManager.hideSearchResults();
    uiManager.showSearchResults(query);

    try {
        const results = await apiManager.searchMovies(query);
        
        // Create a container for search results
        let searchContainer = document.getElementById('searchResultsContainer');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.id = 'searchResultsContainer';
            searchContainer.className = 'movie-category';
            searchContainer.innerHTML = '<h2 class="category-title">📋 Search Results</h2><div class="movie-row" id="searchResultsMovies"></div>';
            
            const searchTitle = document.getElementById('searchResultsTitle');
            if (searchTitle) {
                searchTitle.parentNode.insertBefore(searchContainer, searchTitle.nextSibling);
            }
        }

        const resultsContainer = document.getElementById('searchResultsMovies');
        uiManager.renderMovies('searchResultsMovies', results, apiManager);
        
        uiManager.hideLoading();
    } catch (error) {
        console.error('Search error:', error);
        uiManager.hideLoading();
        uiManager.showError('Search failed. Please try again.');
    }
}

/**
 * Show movie modal (called from movie cards)
 * @param {number} movieId - Movie ID
 */
async function showMovieModal(movieId) {
    if (modalManager) {
        await modalManager.openModal(movieId);
    }
}

// ============================================
// DOM READY
// ============================================

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('register.html')) {
        initAuthPage();
    } else if (path.includes('login.html')) {
        initAuthPage();
    } else if (path.includes('dashboard.html')) {
        initDashboard();
    } else {
        // Default: check auth and redirect
        if (!authManager.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
});

// ============================================
// EXPORT FOR GLOBAL ACCESS
// ============================================

// Make showMovieModal available globally for inline onclick handlers
window.showMovieModal = showMovieModal;
