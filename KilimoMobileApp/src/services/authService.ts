import ApiClient from "./apiClient";
import StorageService from "./storage";
import { API_ENDPOINTS } from "./config";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      fullName: string;
      phoneNumber?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  requiresOTP?: boolean;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiClient.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        credentials,
      );

      if (response.success && response.data) {
        // Save tokens
        await StorageService.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );

        // Save user data
        await StorageService.saveUserData(response.data.user);
      }

      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Register new user
   */
  async signup(signupData: SignupData): Promise<OTPResponse> {
    try {
      const response = await ApiClient.post<OTPResponse>(
        API_ENDPOINTS.SIGNUP,
        signupData,
      );

      if (response.success) {
        // Save email for OTP verification
        await StorageService.saveUserEmail(signupData.email);
      }

      return response;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(data: OTPVerificationData): Promise<AuthResponse> {
    try {
      const response = await ApiClient.post<AuthResponse>(
        API_ENDPOINTS.VERIFY_OTP,
        data,
      );

      if (response.success && response.data) {
        // Save tokens
        await StorageService.saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );

        // Save user data
        await StorageService.saveUserData(response.data.user);
      }

      return response;
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string): Promise<OTPResponse> {
    try {
      const response = await ApiClient.post<OTPResponse>(
        API_ENDPOINTS.RESEND_OTP,
        { email },
      );

      return response;
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<OTPResponse> {
    try {
      const response = await ApiClient.post<OTPResponse>(
        API_ENDPOINTS.FORGOT_PASSWORD,
        { email },
      );

      return response;
    } catch (error: any) {
      console.error("Forgot password error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<OTPResponse> {
    try {
      const response = await ApiClient.post<OTPResponse>(
        API_ENDPOINTS.RESET_PASSWORD,
        { email, otp, newPassword },
      );

      return response;
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await StorageService.clearAll();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await StorageService.getAccessToken();
    return !!token;
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<any> {
    return await StorageService.getUserData();
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || "An error occurred";
      return new Error(message);
    } else if (error.request) {
      // No response received
      return new Error("Network error. Please check your connection.");
    } else {
      // Other errors
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new AuthService();
