const bcrypt = require('bcryptjs');
const User = require('../Models/UserModel');
const { signToken } = require('../Utils/token');

const SALT_ROUNDS = 10;

const CreateUser = async (req, res) => {
    try {
        const { name, number, password } = req.body;

        if (!name || !number || !password) {
            return res.status(400).json({ error: 'Name, phone number, and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        const existingUser = await User.findOne({ where: { number } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ name, number, password: hashedPassword });

        const userResponse = user.toJSON();
        delete userResponse.password;

        const token = signToken({ id: user.id, number: user.number, role: 'user' });

        res.status(201).json({ ...userResponse, token, role: 'user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // A user may only update their own profile.
        if (req.auth.role !== 'user' || String(req.auth.id) !== String(id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { name, number, password } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updates = { name, number };
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters.' });
            }
            updates.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        await user.update(updates);

        const userResponse = user.toJSON();
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.auth.role !== 'user' || String(req.auth.id) !== String(id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const GetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { number, password } = req.body;
        if (!number || !password) {
            return res.status(400).json({ error: 'Phone number and password are required.' });
        }

        const user = await User.findOne({ where: { number } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // bcrypt hashes always start with $2; anything else is a legacy plaintext
        // password from before this migration. Verify it once, then re-hash it
        // so existing accounts don't get locked out.
        const looksHashed = typeof user.password === 'string' && user.password.startsWith('$2');
        const isMatch = looksHashed
            ? await bcrypt.compare(password, user.password)
            : user.password === password;

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!looksHashed) {
            user.password = await bcrypt.hash(password, SALT_ROUNDS);
            await user.save();
        }

        const userResponse = user.toJSON();
        delete userResponse.password;

        const token = signToken({ id: user.id, number: user.number, role: 'user' });

        res.json({ ...userResponse, token, role: 'user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin-only: full user list with order stats used by the admin dashboard.
const GetAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    CreateUser,
    UpdateUser,
    DeleteUser,
    GetUserById,
    LoginUser,
    GetAllUsers,
};
