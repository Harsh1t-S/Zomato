const { CreateUser, UpdateUser, DeleteUser, GetUserById, GetAllUsers, LoginUser } = require('../Controllers/UserController');

const express = require('express');
const router = express.Router();

router.post('/', CreateUser);

router.get('/all', GetAllUsers); 
router.get('/:id', GetUserById);
router.post('/login', LoginUser);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);

module.exports = router;