const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../Controllers/PaymentController');
const { requireAuth, requireRole } = require('../Middleware/auth');

router.post('/create-order', requireAuth, requireRole('user'), createRazorpayOrder);
router.post('/verify', requireAuth, requireRole('user'), verifyPayment);

module.exports = router;
