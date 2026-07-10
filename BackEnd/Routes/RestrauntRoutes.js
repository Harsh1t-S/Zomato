const express = require('express');
const router = express.Router();

const { 
    addRestraunt, 
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require('../Controllers/RestrauntController');

router.post('/add', addRestraunt);
router.get('/all', getAllRestaurants);

router.get('/:id', getRestaurantById);
router.put('/update/:id', updateRestaurant);
router.delete('/delete/:id', deleteRestaurant);

module.exports = router;