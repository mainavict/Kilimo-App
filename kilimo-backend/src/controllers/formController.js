// src/controllers/formController.js
const { submitForm, getSubmissions } = require('../services/formService');
const ErrorResponse = require('../utils/errorResponse');

const submitFormController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    const userId = req.user.id;

    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ErrorResponse('Invalid email format', 400));
    }

    const phoneRegex = /^(\+?254|0)?[7]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return next(new ErrorResponse('Invalid phone number format', 400));
    }

    if (message.length < 10) {
      return next(new ErrorResponse('Message must be at least 10 characters', 400));
    }

    const submission = await submitForm(userId, { firstName, lastName, email, phone, message });

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

const getSubmissionsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const submissions = await getSubmissions(userId);

    res.json({
      success: true,
      count: submissions.length,
      data: { submissions }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitForm: submitFormController, getSubmissions: getSubmissionsController };