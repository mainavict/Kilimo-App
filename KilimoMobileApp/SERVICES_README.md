# Kilimo Mobile App - Services & Middleware Documentation

## 📁 Project Structure

```
src/
├── services/
│   ├── apiClient.ts       # Axios instance with interceptors
│   ├── authService.ts     # Authentication service
│   ├── formService.ts     # Form submission service
│   ├── storage.ts         # AsyncStorage wrapper
│   ├── config.ts          # API configuration
│   └── index.ts           # Services export
├── utils/
│   ├── validation.ts      # Input validation utilities
│   ├── errorHandler.ts    # Error handling utilities
│   ├── formatters.ts      # Data formatting utilities
│   └── index.ts           # Utils export
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🚀 Services Overview

### 1. **API Client** (`apiClient.ts`)

- Axios instance with automatic token injection
- Request/Response interceptors
- Automatic token refresh on 401 errors
- Error handling and logging

**Usage:**

```typescript
import { ApiClient } from "../services";

// GET request
const data = await ApiClient.get("/endpoint");

// POST request
const response = await ApiClient.post("/endpoint", { data });
```

### 2. **Auth Service** (`authService.ts`)

Handles all authentication-related operations:

**Methods:**

- `login(credentials)` - User login
- `signup(signupData)` - User registration
- `verifyOTP(data)` - OTP verification
- `resendOTP(email)` - Resend OTP code
- `forgotPassword(email)` - Request password reset
- `resetPassword(email, otp, newPassword)` - Reset password
- `logout()` - Clear user session
- `isAuthenticated()` - Check auth status
- `getCurrentUser()` - Get user data

**Usage Example:**

```typescript
import { AuthService } from "../services";

// Login
try {
  const response = await AuthService.login({
    email: "user@example.com",
    password: "password123",
  });

  if (response.success) {
    console.log("Logged in:", response.data.user);
  }
} catch (error) {
  console.error("Login failed:", error.message);
}

// Sign up
try {
  const response = await AuthService.signup({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "0712345678",
    password: "password123",
  });

  if (response.success) {
    // Navigate to OTP screen
  }
} catch (error) {
  console.error("Signup failed:", error.message);
}

// Verify OTP
try {
  const response = await AuthService.verifyOTP({
    email: "john@example.com",
    otp: "123456",
  });

  if (response.success) {
    // Navigate to dashboard
  }
} catch (error) {
  console.error("OTP verification failed:", error.message);
}
```

### 3. **Form Service** (`formService.ts`)

Handles form submissions:

**Methods:**

- `submitContactForm(formData)` - Submit contact form
- `submitInquiry(data)` - Submit general inquiry

**Usage Example:**

```typescript
import { FormService } from "../services";

try {
  const response = await FormService.submitContactForm({
    firstName: "Victor",
    lastName: "Mwangi",
    email: "victor@example.com",
    phone: "0712345678",
    message: "I need help with...",
  });

  console.log("Form submitted:", response.message);
} catch (error) {
  console.error("Submission failed:", error.message);
}
```

### 4. **Storage Service** (`storage.ts`)

AsyncStorage wrapper for data persistence:

**Methods:**

- `saveTokens(accessToken, refreshToken)` - Save auth tokens
- `getAccessToken()` - Retrieve access token
- `getRefreshToken()` - Retrieve refresh token
- `removeTokens()` - Clear tokens
- `saveUserData(userData)` - Save user profile
- `getUserData()` - Retrieve user profile
- `clearAll()` - Clear all stored data

## 🛠️ Utilities

### Validation (`validation.ts`)

```typescript
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateOTP,
} from "../utils";

// Email validation
const isValid = validateEmail("user@example.com"); // true

// Phone validation (Kenyan format)
const isValidPhone = validatePhone("0712345678"); // true

// Password validation
const result = validatePassword("MyPass123!");
// { isValid: true, errors: [] }

// OTP validation
const isValidOTP = validateOTP("123456"); // true
```

### Error Handler (`errorHandler.ts`)

```typescript
import { formatErrorMessage, isNetworkError, logError } from "../utils";

try {
  await someApiCall();
} catch (error) {
  const message = formatErrorMessage(error);
  Alert.alert("Error", message);

  if (isNetworkError(error)) {
    // Handle network error
  }

  logError("MyComponent", error);
}
```

### Formatters (`formatters.ts`)

```typescript
import {
  formatPhoneNumber,
  formatDate,
  maskEmail,
  truncateText,
} from "../utils";

const phone = formatPhoneNumber("0712345678"); // +254712345678
const date = formatDate(new Date()); // January 1, 2026
const maskedEmail = maskEmail("user@example.com"); // use***@example.com
const text = truncateText("Long text here", 10); // Long text...
```

## 🔧 Configuration

Update the API base URL in `src/services/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000/api" // Development
    : "https://your-production-url.com/api", // Production
  TIMEOUT: 30000,
};
```

## 📝 Integration Example

### Login Screen with Auth Service:

```typescript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { AuthService } from '../services';
import { validateEmail, formatErrorMessage } from '../utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      if (response.success) {
        // Navigate to dashboard
      }
    } catch (error) {
      Alert.alert('Login Failed', formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Your UI here
  );
}
```

## 🔒 Token Management

The API Client automatically:

1. Injects access token in all requests
2. Refreshes expired tokens
3. Retries failed requests after token refresh
4. Clears tokens and logs out on refresh failure

## 🚨 Error Handling

All services throw errors that can be caught and formatted:

```typescript
try {
  await AuthService.login(credentials);
} catch (error) {
  // error.message contains user-friendly message
  Alert.alert("Error", error.message);
}
```

## 📱 Next Steps

1. Update `API_CONFIG.BASE_URL` to your backend URL
2. Test authentication flow
3. Implement proper navigation after login/signup
4. Add user context/state management (Redux/Context API)
5. Handle logout functionality
6. Implement error boundary component

## 🔗 Backend Integration

Make sure your backend at `kilimo-backend` has the following endpoints:

- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/verify-otp`
- POST `/api/auth/resend-otp`
- POST `/api/auth/refresh-token`
- POST `/api/forms/submit`
