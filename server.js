const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

// Import Routes
const authRoutes = require('./backend/routes/authRoutes');
const noticeRoutes = require('./backend/routes/noticeRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
