const Restraunt = require('../Models/RestrauntModel');
const Vendor = require('../Models/VendorModel');

const addRestraunt = async (req, res) => {
    try {
        const { id, name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews, vendorId } = req.body;

        // Vendors can only create a restaurant tied to their own account (admins may set any vendorId).
        const effectiveVendorId = req.auth.role === 'vendor' ? req.auth.id : vendorId;

        if (req.auth.role === 'vendor') {
            const existing = await Restraunt.findOne({ where: { vendorId: req.auth.id } });
            if (existing) {
                return res.status(400).json({ error: 'You already have a restaurant registered.' });
            }
        }

        const restaurant = await Restraunt.create({ id, name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews, vendorId: effectiveVendorId });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restraunt.findAll();

        // Hide restaurants belonging to a vendor pending admin approval, unless the
        // caller is that vendor themselves or an admin (so they can preview it).
        const vendorIds = [...new Set(restaurants.map(r => r.vendorId).filter(Boolean))];
        const vendors = vendorIds.length
            ? await Vendor.findAll({ where: { id: vendorIds }, attributes: ['id', 'isApproved'] })
            : [];
        const approvalMap = new Map(vendors.map(v => [v.id, v.isApproved]));

        const isPrivileged = req.auth && (req.auth.role === 'admin');
        const visible = restaurants.filter(r => {
            if (!r.vendorId) return true; // platform-owned / seeded restaurant
            if (isPrivileged) return true;
            if (req.auth && req.auth.role === 'vendor' && String(req.auth.id) === String(r.vendorId)) return true;
            return approvalMap.get(r.vendorId) === true;
        });

        res.status(200).json(visible);
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
        const restaurant = await Restraunt.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // A vendor may only edit their own restaurant.
        if (req.auth.role === 'vendor' && String(restaurant.vendorId) !== String(req.auth.id)) {
            return res.status(403).json({ error: 'Forbidden: not your restaurant' });
        }

        const { name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews, vendorId } = req.body;
        // Vendors cannot reassign ownership of their restaurant.
        const updates = { name, location, address, cuisine, rating, deliveryTime, priceForTwo, distance, image, pureVeg, promoted, offer, phone, hours, menu, reviews };
        if (req.auth.role === 'admin' && vendorId !== undefined) updates.vendorId = vendorId;

        await restaurant.update(updates);
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restraunt.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        if (req.auth.role === 'vendor' && String(restaurant.vendorId) !== String(req.auth.id)) {
            return res.status(403).json({ error: 'Forbidden: not your restaurant' });
        }

        await restaurant.destroy();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRestaurantByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const restaurant = await Restraunt.findOne({ where: { vendorId: vendorId } });
        if (restaurant) {
            res.status(200).json(restaurant);
        } else {
            res.status(404).json({ error: 'Restaurant not found for this vendor' });
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
    deleteRestaurant,
    getRestaurantByVendor
};