/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Kenyan format)
 */
export const validatePhone = (phone: string): boolean => {
  // Kenyan phone format: 07XXXXXXXX or +2547XXXXXXXX
  const phoneRegex = /^(\+?254|0)?[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate OTP format (6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate full name
 */
export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};
