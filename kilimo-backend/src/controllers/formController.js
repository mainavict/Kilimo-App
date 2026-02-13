// src/controllers/formController.js
const prisma = require('../models/prisma');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Submit form
 * @route   POST /api/form/submit
 * @access  Private
 */
const submitForm = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const userId = req.user.id;

    // Validation
    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorResponse('Invalid email format', 400));
    }

    // Validate phone format (Kenyan phone numbers or international)
    const phoneRegex = /^(\+?254|0)?[7]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return next(new ErrorResponse('Invalid phone number format', 400));
    }

    // Validate message length
    if (message.length < 10) {
      return next(new ErrorResponse('Message must be at least 10 characters', 400));
    }

    // Create form submission
    const submission = await prisma.formSubmission.create({
      data: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        message
      }
    });

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: submission.id,
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
        createdAt: submission.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's form submissions
 * @route   GET /api/form/submissions
 * @access  Private
 */
const getSubmissions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all submissions for this user
    const submissions = await prisma.formSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      count: submissions.length,
      data: { submissions }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitForm, getSubmissions };