/**
 * TMDB API Configuration
 * 
 * IMPORTANT: Replace the API_KEY with your own TMDB API key
 * Get your free API key at: https://www.themoviedb.org/settings/api
 */

// TMDB API Configuration
const CONFIG = {
    // Replace with your own TMDB API key
    API_KEY: '2dac408e98b098f0e67c4a8729d7f786',
    
    // Base URLs for TMDB API
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    
    // Image sizes
    POSTER_SIZES: {
        small: 'w185',
        medium: 'w342',
        large: 'w500',
        original: 'original'
    },
    
    // Backdrop sizes
    BACKDROP_SIZES: {
        small: 'w300',
        medium: 'w780',
        large: 'w1280',
        original: 'original'
    },
    
    // App name
    APP_NAME: 'Netflix Movies'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
