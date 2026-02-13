// API Configuration
export const API_CONFIG = {
  // Kilimo Backend on Vercel
  BASE_URL: "https://kilimo-app-git-main-mainavicts-projects.vercel.app/api",
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  SIGNUP: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh-token",

  // User endpoints
  PROFILE: "/profile",
  UPDATE_PROFILE: "/profile/update",

  // Form/Contact endpoints
  SUBMIT_FORM: "/forms/submit",
  CONTACT_US: "/forms/contact",
};
