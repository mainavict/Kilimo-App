// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.send('Hello from Kilimo Backend!');
});

// Import routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Error handler (must be last)
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});