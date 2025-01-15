const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS library
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow requests from this origin only
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allow specific HTTP methods
    credentials: true // Allow cookies if needed for authentication
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/turf', require('./routes/TurfDetailsRoutes'));
app.use('/api/ground', require('./routes/GroundRoutes'));
app.use('/api/academy', require('./routes/AcademyRoutes'));
app.use('/api/manager', require('./routes/ManagerGroundRoutes'));
app.use('/api/accounts', require('./routes/AccountRoutes'));
app.use('/uploads', express.static('uploads'));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
