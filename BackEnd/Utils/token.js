require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    console.error('FATAL: JWT_SECRET is not set. Create a .env file (see .env.example).');
    process.exit(1);
}

// role: 'user' | 'vendor' | 'admin'
const signToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken };
