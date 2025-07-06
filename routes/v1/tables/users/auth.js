const express = require('express');
const router = express.Router();
const authController = require('../../../../controllers/users/auth.controller');
const { verifyToken } = require('../../../../middleware/auth');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);

module.exports = router;
