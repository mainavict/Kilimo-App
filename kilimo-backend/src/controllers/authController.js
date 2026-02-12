// src/controllers/authController.js
const { registerUser,loginUser, sendOTP } = require('../services/authService');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
//  @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Register user in database
    const user = await registerUser(email, password);

    // Send OTP to user's email
    await sendOTP(user.id, user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP.',
      data: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

const  login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return next(new ErrorResponse('Please provide email and password', 400));
        }

        const user = await loginUser(email, password);

        await sendOTP(user.id, user.email);

        res.json({
            success: true,
            message: 'Login successful. Please check your email for OTP.',
            data: {
                id: user.id,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        next(error);
    }
    };

module.exports = { register, login };