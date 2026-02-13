import ApiClient from "./apiClient";
import { API_ENDPOINTS } from "./config";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
  data?: any;
}

class FormService {
  /**
   * Submit contact form
   */
  async submitContactForm(formData: ContactFormData): Promise<FormResponse> {
    try {
      const response = await ApiClient.post<FormResponse>(
        API_ENDPOINTS.SUBMIT_FORM,
        formData,
      );

      return response;
    } catch (error: any) {
      console.error("Form submission error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Submit general inquiry
   */
  async submitInquiry(data: any): Promise<FormResponse> {
    try {
      const response = await ApiClient.post<FormResponse>(
        API_ENDPOINTS.CONTACT_US,
        data,
      );

      return response;
    } catch (error: any) {
      console.error("Inquiry submission error:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || "Failed to submit form";
      return new Error(message);
    } else if (error.request) {
      return new Error("Network error. Please check your connection.");
    } else {
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new FormService();
