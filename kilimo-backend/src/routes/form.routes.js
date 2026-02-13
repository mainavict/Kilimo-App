
const express = require('express');
const router = express.Router();
const { submitForm, getSubmissions } = require('../controllers/formController');
const { protect } = require('../middleware/auth');
const { validateForm } = require('../middleware/validation');

// Submit form (requires authentication)
router.post('/submit', protect, validateForm, submitForm);

// Get user's submissions (requires authentication)
router.get('/submissions', protect, getSubmissions);

module.exports = router;