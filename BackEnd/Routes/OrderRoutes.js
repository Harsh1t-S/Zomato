const { createOrder, getAllOrders, getOrderById } = require('../Controllers/OrderController');

const express = require('express');
const router = express.Router();

router.post('/', createOrder);
router.get('/all', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;