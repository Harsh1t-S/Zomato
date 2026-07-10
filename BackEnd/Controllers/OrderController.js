const Orders = require('../Models/OrderModel');

const createOrder = async (req, res) => {
    try {
        const { Orderid, number, totalAmount, restrauntName, orderedItems, ItemPrices } = req.body;
        const order = await Orders.create({ 
            Orderid, 
            number, 
            totalAmount, 
            restrauntName, 
            orderedItems, 
            ItemPrices 
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const requestingUserNumber = req.headers['user-number'];

        if (!requestingUserNumber) {
            return res.status(401).json({ error: 'Unauthorized: User number missing' });
        }

        const order = await Orders.findByPk(id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.number !== requestingUserNumber) {
            return res.status(403).json({ error: 'Forbidden: You cannot access this order' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
};