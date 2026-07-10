const User = require('../Models/UserModel');

CreateUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { number: req.body.number } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this number already exists' });
        }
        else {
            const { name, number, password } = req.body;
            const user = await User.create({ name, number, password });
            res.status(201).json(user);
        }}
     catch (error) {
        res.status(500).json({ error: error.message });
    }
};

UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, number, password } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ name, number, password });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
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

GetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
}}


LoginUser = async (req, res) => {
    try {
        const { number, password } = req.body;
        const user = await User.findOne({ where: { number } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const isMatch = (user.password === password); 
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


GetAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
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