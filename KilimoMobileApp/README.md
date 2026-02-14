# Kilimo Mobile App

A Flutter mobile application for smart farming and agricultural management. Connect with Kilimo's services, submit inquiries, and manage your agricultural journey with a modern, user-friendly interface.

## About Kilimo

Kilimo is your comprehensive agricultural partner, providing smart farming solutions to help you grow your agricultural business. Our mobile app connects farmers with expert services, enabling efficient farm management and produce tracking.

## How to Use the App

### First Time Setup

1. **Download & Install** the Kilimo app on your mobile device
2. **Create Account** using your email and personal details
3. **Verify Email** with the 6-digit OTP sent to your inbox
4. **Start Farming** with access to all Kilimo services

### User Journey

#### Getting Started

1. **Open the App** - Launch Kilimo on your device
2. **Sign Up/Login** - Create a new account or login with existing credentials
   - Enter your email address and password
   - For new users: Provide first name, last name, phone number
   - Choose a strong password (minimum 8 characters)
3. **Email Verification** - Check your email for a 6-digit verification code
   - Enter the OTP using our custom number pad
   - Resend code if needed (available after 60 seconds)

#### Main Dashboard

After successful login, you'll access your personalized dashboard featuring:

- **Welcome Section** - Your gateway to Kilimo services
- **Quick Actions** - Fast access to key features:
  - **Contact Us** - Get in touch with our agricultural experts
  - **Farm Management** - Manage your farm data and operations
  - **Analytics** - View detailed farm reports and insights
  - **Inventory** - Track your produce and livestock

#### Contact Our Team

1. **Tap "Contact Us"** from the dashboard
2. **Fill the Form** with your inquiry:
   - Personal details (auto-filled from your profile)
   - Phone number (Kenyan format: +254 or 07XXXXXXXX)
   - Detailed message about your agricultural needs (up to 1000 characters)
3. **Submit** - Your inquiry goes directly to our agricultural experts
4. **Get Response** - Our team will respond via email or phone

### App Features

#### Smart Authentication

- **Secure Login** - JWT-based authentication system
- **Email Verification** - OTP verification for account security
- **Auto-Login** - Stay logged in for convenient access
- **Password Security** - Strong password requirements

#### Professional UI/UX

- **Kilimo Branding** - Consistent green theme (#00D563) representing growth
- **Modern Design** - Clean, intuitive interface built with Flutter
- **Responsive Layout** - Perfect display on all screen sizes
- **Real-time Feedback** - Live form validation and loading states

#### Communication Features

- **Contact Form** - Direct line to agricultural experts
- **Form Validation** - Real-time validation prevents submission errors
- **Character Counter** - Track your message length (1000 char limit)
- **Success Notifications** - Confirmation when your message is sent

## Getting Started (For Developers)

### Prerequisites

- Flutter SDK (>=3.13.0)
- Dart SDK (>=3.1.0)
- Internet connection for API access

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd KilimoMobileApp
   ```

2. Install dependencies:

   ```bash
   flutter pub get
   ```

3. Run the app:
   ```bash
   flutter run
   ```

The app will connect to our live backend at `https://kilimo-app-nine.vercel.app/api`

## Backend Integration

### Live API Endpoints

- **Base URL**: `https://kilimo-app-nine.vercel.app/api`
- **Authentication**:
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `POST /auth/verify-otp` - OTP verification
- **Communication**:
  - `POST /forms` - Submit contact inquiries (requires authentication)

### API Features

- **Error Handling** - Comprehensive error messages and status codes
- **Token Management** - Automatic JWT token handling
- **Secure Headers** - All requests include proper authentication
- **Response Processing** - Standardized API response handling

## User Guide

### Creating Your Account

1. **Personal Information**:
   - First Name (e.g., "John")
   - Last Name (e.g., "Farmer")
   - Email Address (valid email required)
   - Phone Number (Kenyan format: 0712345678 or +254712345678)
   - Password (minimum 8 characters)

2. **Email Verification**:
   - Check your email inbox for "Kilimo OTP Verification"
   - Enter the 6-digit code using our number pad
   - Code expires in 10 minutes
   - Can resend after 60 seconds if needed

### Using the Dashboard

- **Welcome Card** - Overview of your Kilimo journey
- **Quick Actions Grid** - Access main features:
  - Green cards are active and ready to use
  - Blue, orange, and purple cards are coming soon
- **Recent Activity** - Your farming activities will appear here

### Contacting Support

1. **From Dashboard** - Tap "Contact Us" green card
2. **Form Fields**:
   - Name fields (auto-filled from your profile)
   - Email (auto-filled, but can be edited)
   - Phone (must be in Kenyan format)
   - Message (describe your agricultural needs, up to 1000 characters)
3. **Submit** - Form validates all fields before submission
4. **Confirmation** - Success message confirms your inquiry was sent

### Account Management

- **Logout** - Use the "Logout" button in the top-right corner
- **Auto-Login** - App remembers you for convenient access
- **Security** - All data is encrypted and securely transmitted

1. Navigate to the project directory:

   ```bash
   cd KilimoMobileApp
   ```

2. Get dependencies:

   ```bash
   flutter pub get
   ```

3. Ensure backend is running:

   ```bash
   cd ../kilimo-backend
   npm install
   npm run dev
   ```

4. Run the app:
   ```bash
   flutter run
   ```

## Project Structure

```
lib/
├── main.dart                          # App entry point with auth wrapper
├── screens/
│   ├── login_screen.dart             # Email/password login with validation
│   ├── register_screen.dart          # User registration form
│   ├── otp_verification_screen.dart  # 6-digit OTP verification with keypad
│   ├── dashboard_screen.dart         # Main dashboard with quick actions
│   └── contact_form_screen.dart      # Contact form with backend integration
└── services/
    └── api_service.dart              # Backend API integration service
```

## Backend Integration

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/otp/verify` - OTP verification with JWT token response

### Form Submission

- `POST /api/form/submit` - Submit contact form (requires authentication)
- `GET /api/form/submissions` - Get user's form submissions

### API Service Features

- **Error Handling**: Custom `ApiException` with status codes and messages
- **Token Management**: Automatic JWT token storage using SharedPreferences
- **Request Headers**: Automatic authorization header inclusion for protected routes
- **Response Processing**: Standardized response handling across all endpoints

## 🎯 Key Components

### Custom OTP Input

- 6-digit verification code input fields
- Real-time highlighting of filled fields
- Custom number pad with backspace functionality
- Auto-focus management for smooth user experience

### Form Validation

- **Email**: RFC-compliant email validation
- **Phone**: Kenyan phone number format (`+254` or `07XXXXXXXX`)
- **Password**: Minimum 8 characters with strength indicators
- **Form Fields**: Required field validation with clear error messages

### State Management

- Loading states for all async operations
- Form validation states with real-time feedback
- Authentication state persistence across app restarts
- Toast notifications for user feedback

## Dependencies

```yaml
dependencies:
  flutter: sdk
  google_fonts: ^6.1.0 # Inter font family
  http: ^1.1.0 # API communication
  shared_preferences: ^2.2.2 # Local token storage
  fluttertoast: ^8.2.4 # User notifications
  cupertino_icons: ^1.0.2 # iOS-style icons
```

## Configuration

### Backend URL

The app connects to our live Vercel deployment. The API base URL is configured in `lib/services/api_service.dart`:

```dart
static const String baseUrl = 'https://kilimo-app-nine.vercel.app/api';
```

### Theme Colors

The app uses Kilimo's signature green branding:

```dart
ColorScheme.fromSeed(
  seedColor: const Color(0xFF00D563), // Kilimo green
  primary: const Color(0xFF00D563),
),
```

## Error Handling

The app includes comprehensive error handling:

- **Network Errors**: Connection timeouts and server unavailability
- **Validation Errors**: Real-time form validation with user-friendly messages
- **API Errors**: Backend error responses with appropriate user feedback
- **Authentication Errors**: Token expiration and unauthorized access handling

## Contact Form Fields

The contact form submits data in the following format:

```json
{
  "firstName": "Victor",
  "lastName": "Mwangi",
  "email": "kilimo.user@example.com",
  "phone": "0712345678",
  "message": "I am interested in learning more about Kilimo agricultural services..."
}
```

All fields are required and validated according to backend specifications.

## Authentication Flow

1. **User Login/Register** → Backend validates credentials
2. **OTP Generation** → Backend sends 6-digit code via email
3. **OTP Verification** → User enters code, backend returns JWT token
4. **Token Storage** → App stores token locally using SharedPreferences
5. **Authenticated Requests** → All protected API calls include the token
6. **Auto-Login** → App checks for valid token on startup

## UI/UX Highlights

## Troubleshooting

### Common Issues

**"Connection Error"**

- Check your internet connection
- Ensure the backend service is running
- Try refreshing the app

**"OTP Not Received"**

- Check spam/junk folder in email
- Wait 60 seconds and use "Resend OTP"
- Ensure email address is correct during registration

**"Form Validation Errors"**

- Phone number must be in Kenyan format (0712345678 or +254712345678)
- Email must be a valid email address
- Password must be at least 8 characters
- All fields are required

**"Authentication Failed"**

- Double-check email and password
- Try resetting password if available
- Ensure account was properly verified

## Tips for Best Experience

1. **Use Strong Passwords** - Include numbers, letters, and special characters
2. **Keep Email Active** - OTP codes are sent via email
3. **Fill Complete Information** - Accurate contact details help our team respond better
4. **Describe Your Needs** - Detailed messages get better responses from our agricultural experts
5. **Stay Connected** - Enable notifications for updates on your inquiries

## Security & Privacy

- **Encrypted Communication** - All data transmission uses HTTPS
- **JWT Authentication** - Industry-standard token-based security
- **Local Storage** - Tokens stored securely on device
- **No Data Sharing** - Your information is only used for agricultural services
- **Email Verification** - Ensures account authenticity

## Agricultural Services Available

Through the Kilimo app, you can access:

1. **Farm Management Consulting** - Expert advice on crop planning and farm optimization
2. **Soil Analysis Services** - Professional soil testing and recommendations
3. **Irrigation Solutions** - Smart irrigation system design and installation
4. **Crop Monitoring** - Advanced monitoring and pest management advice
5. **Market Linkage** - Connect with buyers and agricultural markets
6. **Financial Services** - Access to agricultural loans and insurance
7. **Training Programs** - Modern farming techniques and technology adoption

## Future Features Coming Soon

- **Real-time Analytics** - Live farm data and performance metrics
- **Weather Integration** - Local weather forecasts for farming decisions
- **Marketplace** - Buy and sell agricultural products
- **Community Features** - Connect with other farmers
- **Push Notifications** - Instant updates on your inquiries
- **Farm Search** - Find and visit model farms in your area
- **Financial Tracking** - Track farm expenses and revenue

## Support

Need help with the app or have agricultural questions?

- **In-App Contact Form** - Use the "Contact Us" feature for agricultural inquiries
- **Technical Support** - Report app issues through the contact form
- **Emergency Agricultural Support** - Call our hotline (coming soon)

## Why Choose Kilimo?

- **Expert Agricultural Team** - Qualified agronomists and farming specialists
- **Modern Technology** - Latest farming techniques and smart solutions
- **Proven Results** - Track record of successful farm transformations
- **Local Knowledge** - Understanding of Kenyan farming conditions
- **Comprehensive Support** - From planning to harvest and beyond
- **Affordable Solutions** - Cost-effective farming improvements

---

**Ready to transform your farming journey? Download Kilimo today! **

_"Growing together towards sustainable agriculture"_
