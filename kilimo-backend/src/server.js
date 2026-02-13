// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Kilimo Backend is running!'
  });
});

// Basic test route
app.get('/', (req, res) => {
  res.send(`
    <h1>🌱 Kilimo App Backend</h1>
    <p>API Endpoints:</p>
    <ul>
      <li><strong>POST /api/auth/register</strong> - Register user</li>
      <li><strong>POST /api/auth/login</strong> - Login user</li>
      <li><strong>POST /api/otp/verify</strong> - Verify OTP</li>
      <li><strong>POST /api/form/submit</strong> - Submit form (authenticated)</li>
      <li><strong>GET /api/form/submissions</strong> - Get submissions (authenticated)</li>
      <li><strong>GET /api/profile</strong> - Get profile (authenticated)</li>
      <li><strong>GET /api/health</strong> - Health check</li>
    </ul>
    <p>Full API documentation available in README.md</p>
  `);
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const otpRoutes = require('./routes/otp.routes');
const profileRoutes = require('./routes/profile.routes');
const formRoutes = require('./routes/form.routes');
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/form', formRoutes);

// Error handler (must be last)
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Export for Vercel serverless
module.exports = app;

// Local development server (only runs when executed directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
  });
}
