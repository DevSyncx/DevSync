const { RateLimiterMemory } = require('rate-limiter-flexible');

exports.authLimiter = new RateLimiterMemory({
    points: 20,    // Increased from 5 to 20 attempts
    duration: 60,  // Per minute
    blockDuration: 60 * 2, // Reduced block time to 2 minutes
})