const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, getOrdersByRestaurant } = require('../Controllers/OrderController');

router.post('/', createOrder);
router.get('/all', getAllOrders);
router.get('/restaurant/:id', getOrdersByRestaurant);
router.get('/:id', getOrderById);

module.exports = router;