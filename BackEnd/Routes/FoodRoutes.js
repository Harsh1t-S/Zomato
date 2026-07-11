const { getAllFood, addFood, updateFood, deleteFood } = require('../Controllers/FoodController');
const { requireAuth, requireRole } = require('../Middleware/auth');

const express = require('express');
const router = express.Router();

router.get('/', getAllFood);
router.post('/', requireAuth, requireRole('vendor', 'admin'), addFood);
router.put('/:id', requireAuth, requireRole('vendor', 'admin'), updateFood);
router.delete('/:id', requireAuth, requireRole('vendor', 'admin'), deleteFood);

module.exports = router;
