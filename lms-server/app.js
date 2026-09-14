const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { getEnvConfig } = require('./config/env');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { createRateLimiter } = require('./middleware/rateLimit');
const secureHeaders = require('./middleware/secureHeaders');
const mongoSanitize = require('./middleware/mongoSanitize');

const app = express();
const config = getEnvConfig();

app.use(cors({
  origin: config.NODE_ENV === 'production' ? config.CLIENT_URL : true,
  credentials: true,
}));
app.use(secureHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize);
app.use(requestLogger);

const loginRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many login attempts. Please try again later.',
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbConnected = dbState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth/login', loginRateLimit);
app.use('/api/teacher/login', loginRateLimit);
app.use('/api/student/login', loginRateLimit);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/admin', require('./routes/admin'));
app.use(errorHandler);

module.exports = app;
