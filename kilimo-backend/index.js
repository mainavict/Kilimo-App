// index.js - Vercel entry point
try {
  const app = require('./src/server');
  module.exports = app;
} catch (error) {
  console.error('Failed to load server:', error);
  // Export a minimal error app
  const express = require('express');
  const errorApp = express();
  errorApp.get('*', (req, res) => {
    res.status(500).json({
      error: 'Server failed to initialize',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  });
  module.exports = errorApp;
}
