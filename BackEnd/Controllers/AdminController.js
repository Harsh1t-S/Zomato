const { signToken } = require('../Utils/token');

// Single-admin setup driven by env vars. Good enough for a solo-operated
// platform; swap for an Admin table + bcrypt if you ever have multiple admins.
const LoginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({ error: 'Invalid admin credentials.' });
        }

        const token = signToken({ id: 'admin', role: 'admin' });
        res.json({ token, role: 'admin', name: 'Admin' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { LoginAdmin };
