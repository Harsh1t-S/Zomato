const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, getOrdersByRestaurant, updateOrderStatus, getMyOrders } = require('../Controllers/OrderController');
const { requireAuth, requireRole } = require('../Middleware/auth');

router.post('/', requireAuth, requireRole('user'), createOrder);
router.get('/all', requireAuth, requireRole('admin'), getAllOrders);
router.get('/mine', requireAuth, requireRole('user'), getMyOrders);
router.get('/restaurant/:id', requireAuth, requireRole('vendor', 'admin'), getOrdersByRestaurant);
router.put('/:id/status', requireAuth, requireRole('vendor', 'admin'), updateOrderStatus);
router.get('/:id', requireAuth, getOrderById);

module.exports = router;
