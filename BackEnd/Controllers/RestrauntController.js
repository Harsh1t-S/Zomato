const Restraunt = require('../Models/RestrauntModel');

const addRestraunt = async (req, res) => {
    try {
        const { id, name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews } = req.body;
        const restaurant = await Restraunt.create({ id, name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restraunt.findAll();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restraunt.findByPk(id);
        if (restaurant) {
            res.status(200).json(restaurant);
        } else {
            res.status(404).json({ error: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews } = req.body;
        const restaurant = await Restraunt.findByPk(id);
        if (restaurant) {
            await restaurant.update({ name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews });
            res.status(200).json(restaurant);
        } else {
            res.status(404).json({ error: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restraunt.findByPk(id);
        if (restaurant) {
            await restaurant.destroy();
            res.status(200).json({ message: 'Restaurant deleted successfully' });
        } else {
            res.status(404).json({ error: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getAllRestaurants, 
    getRestaurantById,
    updateRestaurant,
    addRestraunt,
    deleteRestaurant
};