const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Register user
router.post('/register', upload.single('profilePic'), authController.register);

// Login user
router.post('/login', authController.login);

// Protected routes
router.use(verifyToken);

// Get current user
router.get('/me', authController.getCurrentUser);

// Update user profile
router.put('/profile', upload.single('profilePic'), authController.updateProfile);

module.exports = router;