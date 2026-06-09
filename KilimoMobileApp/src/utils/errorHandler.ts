/**
 * Format error message for display
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message === "Network Error" ||
    error?.code === "ECONNABORTED" ||
    error?.request?._hasError === true
  );
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

/**
 * Log error for debugging
 */
export const logError = (context: string, error: any): void => {
  if (__DEV__) {
    console.group(`❌ Error in ${context}`);
    console.error("Error:", error);
    if (error?.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    console.groupEnd();
  }
};
