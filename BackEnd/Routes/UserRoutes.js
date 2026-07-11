const { CreateUser, UpdateUser, DeleteUser, GetUserById, GetAllUsers, LoginUser } = require('../Controllers/UserController');
const { requireAuth, requireRole } = require('../Middleware/auth');
const { loginLimiter, registerLimiter } = require('../Middleware/rateLimit');

const express = require('express');
const router = express.Router();

router.post('/', registerLimiter, CreateUser);
router.post('/login', loginLimiter, LoginUser);

router.get('/all', requireAuth, requireRole('admin'), GetAllUsers);
router.get('/:id', requireAuth, GetUserById);
router.put('/:id', requireAuth, UpdateUser);
router.delete('/:id', requireAuth, DeleteUser);

module.exports = router;
