// src/middleware/logger.js
const morgan = require('morgan');

// Custom token for response time
morgan.token('response-time', (req, res) => {
  return res.responseTime ? `${res.responseTime}ms` : '-';
});

// Custom format
const logger = morgan(
  ':method :url :status :response-time :res[content-length] - :user-agent',
  {
    skip: (req, res) => process.env.NODE_ENV === 'test',
    stream: {
      write: (message) => {
        console.log(message.trim());
      }
    }
  }
);

module.exports = logger;