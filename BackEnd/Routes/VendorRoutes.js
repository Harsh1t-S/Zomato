const express = require('express');
const router = express.Router();
const { RegisterVendor, LoginVendor, GetAllVendors } = require('../Controllers/VendorController');

router.post('/register', RegisterVendor);
router.post('/login', LoginVendor);
router.get('/all', GetAllVendors);

module.exports = router;