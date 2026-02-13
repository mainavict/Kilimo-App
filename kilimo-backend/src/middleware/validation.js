// src/middleware/validation.js
const { z } = require('zod');
const ErrorResponse = require('../utils/errorResponse');

// Form submission validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+?254|0)?[7]\d{8}$/, 'Invalid Kenyan phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long')
});

// Register validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// OTP validation schema
const otpSchema = z.object({
  userId: z.string().min(1,'Invalid user ID'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits')
});

const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const errorMessage = error.errors?.[0]?.message || 'Validation failed';
      next(new ErrorResponse(errorMessage, 400));
    }
  };
};

module.exports = {
  validateForm: validate(formSchema),
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateOTP: validate(otpSchema)
};