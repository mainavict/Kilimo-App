// src/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// Get user profile (requires authentication)
router.get('/', protect, getProfile);

module.exports = router;