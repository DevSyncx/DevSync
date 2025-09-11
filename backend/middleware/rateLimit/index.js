const { authLimiter } = require('./authLimiterMiddleware');
const { generalLimiter } = require('./generalLimiterMiddleware');


exports.authMiddleware = (req, res, next) => {
    authLimiter.consume(req.ip).then(() => next()).catch(() => {
        res.status(429).json({ message: "Too many login/signup attempts, please try later." });
    });
}

exports.generalMiddleware = (req, res, next) => {
    generalLimiter.consume(req.ip).then(() => next()).catch(() => {
        res.status(429).json({ message: "Too many requests, please slow down." });
    })
}