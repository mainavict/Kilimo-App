// src/middleware/auth.js
const ErrorResponse = require('../utils/errorResponse');
const { verifyToken } = require('../services/jwtService');
const prisma = require('../models/prisma');

/**
 * Protect routes - require authentication
 * This middleware extracts the user from the JWT token
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, return error
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        isVerified: true
      }
    });

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

module.exports = { protect };