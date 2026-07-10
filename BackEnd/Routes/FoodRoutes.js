const { getAllFood, addFood } = require('../Controllers/FoodController');

const express = require('express');
const router = express.Router();

router.get('/', getAllFood);
router.post('/', addFood);

module.exports = router;