const Orders = require('../Models/OrderModel');
const Restraunt = require('../Models/RestrauntModel');

const createOrder = async (req, res) => {
    try {
        const { Orderid, number, totalAmount, restrauntName, restrauntId, orderedItems, ItemPrices } = req.body;
        const order = await Orders.create({
            Orderid,
            number,
            totalAmount,
            restrauntName,
            restrauntId,
            orderedItems,
            ItemPrices,
            status: 'placed'
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin-only
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Orders.findByPk(id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // The customer who placed it, the vendor who owns the restaurant, or an admin may view it.
        if (req.auth.role === 'user' && order.number !== req.auth.number) {
            return res.status(403).json({ error: 'Forbidden: You cannot access this order' });
        }
        if (req.auth.role === 'vendor') {
            const restaurant = await Restraunt.findByPk(order.restrauntId);
            if (!restaurant || String(restaurant.vendorId) !== String(req.auth.id)) {
                return res.status(403).json({ error: 'Forbidden: You cannot access this order' });
            }
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vendor (own restaurant) or admin
const getOrdersByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.auth.role === 'vendor') {
            const restaurant = await Restraunt.findByPk(id);
            if (!restaurant || String(restaurant.vendorId) !== String(req.auth.id)) {
                return res.status(403).json({ error: 'Forbidden: not your restaurant' });
            }
        }

        const orders = await Orders.findAll({
            where: { restrauntId: id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vendor (own restaurant) or admin
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const order = await Orders.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (req.auth.role === 'vendor') {
            const restaurant = await Restraunt.findByPk(order.restrauntId);
            if (!restaurant || String(restaurant.vendorId) !== String(req.auth.id)) {
                return res.status(403).json({ error: 'Forbidden: not your restaurant' });
            }
        }

        await order.update({ status });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// The logged-in customer's own orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            where: { number: req.auth.number },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByRestaurant,
    updateOrderStatus,
    getMyOrders,
};
