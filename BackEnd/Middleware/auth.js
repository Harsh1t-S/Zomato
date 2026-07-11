const { verifyToken } = require('../Utils/token');

// Verifies a valid JWT is present. Attaches decoded payload to req.auth.
const requireAuth = (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: no token provided' });
    }

    try {
        req.auth = verifyToken(token);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
    }
};

// Restricts to specific roles, e.g. requireRole('vendor'), requireRole('vendor', 'admin')
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};

// Like requireAuth, but doesn't fail if no token is present — just leaves
// req.auth undefined. Useful for public endpoints that personalize results
// for a logged-in vendor/admin without requiring login.
const optionalAuth = (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (token) {
        try {
            req.auth = verifyToken(token);
        } catch (err) {
            // ignore invalid token on optional routes
        }
    }
    next();
};

module.exports = { requireAuth, requireRole, optionalAuth };
