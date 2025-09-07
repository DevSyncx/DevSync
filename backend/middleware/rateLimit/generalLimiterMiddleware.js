const { RateLimiterMemory } = require('rate-limiter-flexible');

exports.generalLimiter = new RateLimiterMemory({
    points: 100,
    duration: 60,
    blockDuration: 60 * 2,
})