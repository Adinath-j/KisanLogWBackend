require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const yieldRoutes = require('./routes/yields');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Body parser - parse JSON request bodies
app.use(express.json());

// Cookie parser - parse cookies from requests
app.use(cookieParser());

// CORS - Enable cross-origin requests with credentials
// Since frontend and backend are served from the same origin (port 5000),
// we configure CORS to allow same-origin requests with cookies
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

// ============================================
// DATABASE CONNECTION
// ============================================

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kisanlog';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if database connection fails
  });

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/yields', yieldRoutes);

// SERVE FRONTEND STATIC FILES
// ============================================

// Serve the frontend folder at the root URL
// This allows accessing the frontend files at http://localhost:5000/
app.use(express.static(path.join(__dirname, '../frontend')));


// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Global error handler for uncaught errors
app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log('🚀 KisanLog Backend Server');
  console.log('════════════════════════════════════════');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log('════════════════════════════════════════');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process in production
  // server.close(() => process.exit(1));
});