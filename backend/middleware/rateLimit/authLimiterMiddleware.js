const { RateLimiterMemory } = require('rate-limiter-flexible');

exports.authLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
    blockDuration: 60 * 5,
})