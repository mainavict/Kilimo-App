// Export all services
export { default as ApiClient } from "./apiClient";
export { default as AuthService } from "./authService";
export { default as FormService } from "./formService";
export { default as StorageService } from "./storage";
export { API_CONFIG, API_ENDPOINTS } from "./config";

// Export types
export type {
  LoginCredentials,
  SignupData,
  OTPVerificationData,
  AuthResponse,
  OTPResponse,
} from "./authService";

export type { ContactFormData, FormResponse } from "./formService";
