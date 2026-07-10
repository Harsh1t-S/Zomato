const Food = require('../Models/FoodModel');

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
        const { restrauntId, name, description, price, category, imageUrl } = req.body;
        const newFood = await Food.create({ restrauntId, name, description, price, category, imageUrl });
        res.status(201).json(newFood);
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ error: 'Failed to add food item' });
    }
};

module.exports = {
    getAllFood,
    addFood
};