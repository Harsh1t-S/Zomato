const Food = require('../Models/FoodModel');
const Restraunt = require('../Models/RestrauntModel');

const getAllFood = async (req, res) => {
    try {
        const foodItems = await Food.findAll();
        res.json(foodItems);
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Failed to fetch food items' });
    }
};

const addFood = async (req, res) => {
    try {
        const { restrauntId, name, description, price, category, imageUrl, veg } = req.body;

        if (!restrauntId || !name || !price) {
            return res.status(400).json({ error: 'restrauntId, name, and price are required.' });
        }

        // Vendors can only add items to their own restaurant.
        if (req.auth.role === 'vendor') {
            const restaurant = await Restraunt.findByPk(restrauntId);
            if (!restaurant || String(restaurant.vendorId) !== String(req.auth.id)) {
                return res.status(403).json({ error: 'Forbidden: not your restaurant' });
            }
        }

        const newFood = await Food.create({ restrauntId, name, description, price, category, imageUrl, veg: !!veg });
        res.status(201).json(newFood);
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ error: 'Failed to add food item' });
    }
};

const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findByPk(id);
        if (!food) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        if (req.auth.role === 'vendor') {
            const restaurant = await Restraunt.findByPk(food.restrauntId);
            if (!restaurant || String(restaurant.vendorId) !== String(req.auth.id)) {
                return res.status(403).json({ error: 'Forbidden: not your restaurant' });
            }
        }

        const { name, description, price, category, imageUrl, veg } = req.body;
        await food.update({ name, description, price, category, imageUrl, veg: !!veg });
        res.json(food);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findByPk(id);
        if (!food) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        // Vendors may only delete items on their own restaurant. Admins may
        // remove any item (moderation), so no ownership check for them.
        if (req.auth.role === 'vendor') {
            const restaurant = await Restraunt.findByPk(food.restrauntId);
            if (!restaurant || String(restaurant.vendorId) !== String(req.auth.id)) {
                return res.status(403).json({ error: 'Forbidden: not your restaurant' });
            }
        }

        await food.destroy();
        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin-only: flag or unflag a food item for moderation, instead of editing
// or removing it outright. If `isFlagged` isn't provided in the body, the
// current value is toggled.
const flagFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findByPk(id);
        if (!food) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        const isFlagged = typeof req.body.isFlagged === 'boolean' ? req.body.isFlagged : !food.isFlagged;
        await food.update({ isFlagged });
        res.json(food);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllFood,
    addFood,
    updateFood,
    deleteFood,
    flagFood,
};
