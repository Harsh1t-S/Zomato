const express = require('express');
const router = express.Router();
const { RegisterVendor, LoginVendor, GetAllVendors, ApproveVendor, UpdateVendor } = require('../Controllers/VendorController');
const { requireAuth, requireRole } = require('../Middleware/auth');
const { loginLimiter, registerLimiter } = require('../Middleware/rateLimit');

router.post('/register', registerLimiter, RegisterVendor);
router.post('/login', loginLimiter, LoginVendor);
router.get('/all', requireAuth, requireRole('admin'), GetAllVendors);
router.put('/approve/:id', requireAuth, requireRole('admin'), ApproveVendor);
router.put('/:id', requireAuth, requireRole('vendor'), UpdateVendor);

module.exports = router;
