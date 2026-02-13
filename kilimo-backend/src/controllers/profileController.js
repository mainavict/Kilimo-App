// src/controllers/profileController.js
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile };