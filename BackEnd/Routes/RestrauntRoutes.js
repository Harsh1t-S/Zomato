const express = require('express');
const router = express.Router();
const { requireAuth, requireRole, optionalAuth } = require('../Middleware/auth');

const {
    addRestraunt,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantByVendor
} = require('../Controllers/RestrauntController');

router.get('/all', optionalAuth, getAllRestaurants);
router.get('/vendor/:vendorId', requireAuth, requireRole('vendor', 'admin'), getRestaurantByVendor);
router.get('/:id', getRestaurantById);

router.post('/add', requireAuth, requireRole('vendor', 'admin'), addRestraunt);
router.put('/update/:id', requireAuth, requireRole('vendor', 'admin'), updateRestaurant);
router.delete('/delete/:id', requireAuth, requireRole('vendor', 'admin'), deleteRestaurant);

module.exports = router;
