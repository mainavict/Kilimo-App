# Kilimo Backend API

A robust Node.js backend API for the Kilimo Agriculture Application, providing user authentication, form submissions, OTP verification, and profile management.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **OTP Verification**: Email-based OTP system for user verification
- **Form Management**: Secure form submission and retrieval system
- **Profile Management**: User profile management with authentication
- **Security**: Rate limiting, CORS, helmet security middleware
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: Integration with Nodemailer and Resend
- **Validation**: Request validation using Zod
- **Deployment**: Optimized for Vercel serverless deployment

## Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer + Resend
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit
- **Developer Tools**: Morgan (logging)

## Project Structure

```
kilimo-backend/
├── index.js                 # Vercel entry point
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment config
├── prisma/
│   └── schema.prisma       # Database schema
└── src/
    ├── server.js           # Main Express server
    ├── test-prisma.js      # Prisma connection test
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    │   ├── authController.js
    │   ├── formController.js
    │   ├── otpController.js
    │   ├── passwordResetController.js
    │   └── profileController.js
    ├── middleware/         # Custom middleware
    │   ├── auth.js
    │   ├── errorHandler.js
    │   ├── logger.js
    │   └── validation.js
    ├── models/
    │   └── prisma.js       # Prisma client instance
    ├── routes/             # API routes
    │   ├── auth.routes.js
    │   ├── form.routes.js
    │   ├── otp.routes.js
    │   └── profile.routes.js
    ├── services/           # Business logic services
    │   ├── authService.js
    │   ├── emailService.js
    │   ├── formService.js
    │   ├── jwtService.js
    │   ├── otpService.js
    │   └── passwordResetService.js
    └── utils/              # Utility functions
        ├── errorResponse.js
        └── generateOTP.js
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. The database includes:

### User Model

- `id`: Unique UUID identifier
- `email`: Unique user email
- `password`: Hashed password
- `isVerified`: Email verification status
- `createdAt`/`updatedAt`: Timestamps

### OTP Model

- `id`: Unique UUID identifier
- `userId`: Reference to User
- `code`: OTP code
- `type`: OTP type (default: "VERIFICATION")
- `attempts`: Number of attempts made
- `maxAttempts`: Maximum allowed attempts (default: 3)
- `expiresAt`: Expiration timestamp
- `used`: Whether OTP has been used

### FormSubmission Model

- `id`: Unique UUID identifier
- `userId`: Reference to User
- `firstName`: Submitter's first name
- `lastName`: Submitter's last name
- `email`: Submitter's email
- `phone`: Submitter's phone number
- `message`: Form message
- `createdAt`: Submission timestamp

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### OTP Routes (`/api/otp`)

- `POST /api/otp/verify` - Verify OTP code

### Form Routes (`/api/form`)

- `POST /api/form/submit` - Submit form (requires authentication)
- `GET /api/form/submissions` - Get user's form submissions (requires authentication)

### Profile Routes (`/api/profile`)

- `GET /api/profile` - Get user profile (requires authentication)

### System Routes

- `GET /api/health` - Health check endpoint
- `GET /` - API documentation homepage

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- PostgreSQL database
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="******************************************************************8"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

```

### Installation

1. Clone the repository:

```bash
git clone <https://github.com/mainavict/Kilimo-App/tree/main/kilimo-backend>
cd kilimo-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
# Generate Prisma client
npm run build

# Run database migrations
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run build` - Generate Prisma client
- `npm run vercel-build` - Build for Vercel deployment

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-Origin Resource Sharing enabled
- **Helmet**: Security headers middleware
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation
- **OTP Security**: Time-limited codes with attempt limits

## Deployment

The application is optimized for Vercel serverless deployment:

1. The `index.js` file serves as the Vercel entry point
2. The `vercel.json` configuration is included
3. Database binary targets include Vercel-compatible settings
4. Environment variables should be configured in Vercel dashboard

## Error Handling

The application includes comprehensive error handling:

- Global error handler middleware
- Structured error responses
- Development vs production error details
- Rate limiting responses
- Authentication error handling

## Contributing

1. Follow the established project structure
2. Use Prisma for all database operations
3. Implement proper error handling
4. Add input validation using Zod
5. Include appropriate middleware for security
6. Test endpoints before submitting

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## License

MIT

## Author

Victor Mwangi Maina
