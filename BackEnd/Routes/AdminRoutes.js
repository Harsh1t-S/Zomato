const express = require('express');
const router = express.Router();
const { LoginAdmin } = require('../Controllers/AdminController');
const { loginLimiter } = require('../Middleware/rateLimit');

router.post('/login', loginLimiter, LoginAdmin);

module.exports = router;
