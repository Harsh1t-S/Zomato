const { getAllFood, addFood, updateFood, deleteFood, flagFood } = require('../Controllers/FoodController');
const { requireAuth, requireRole } = require('../Middleware/auth');

const express = require('express');
const router = express.Router();

router.get('/', getAllFood);
// Menu items are managed by the vendor that owns the restaurant — admins do
// not create or edit menu content, only moderate it (flag/remove below).
router.post('/', requireAuth, requireRole('vendor'), addFood);
router.put('/:id', requireAuth, requireRole('vendor'), updateFood);
router.patch('/:id/flag', requireAuth, requireRole('admin'), flagFood);
router.delete('/:id', requireAuth, requireRole('vendor', 'admin'), deleteFood);

module.exports = router;
