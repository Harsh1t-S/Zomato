const rateLimit = require('express-rate-limit');

// Applied to login endpoints: generous enough for a real user mistyping their
// password a few times, tight enough to make brute-forcing impractical.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again in a few minutes.' },
});

// Applied to registration endpoints: looser, but still bounded to slow down
// scripted account creation.
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many accounts created from this network. Please try again later.' },
});

module.exports = { loginLimiter, registerLimiter };
