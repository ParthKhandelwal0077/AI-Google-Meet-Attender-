const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const meetingRoutes = require('./routes/meetingRoutes');
const { initBucket } = require('./config/gridfs');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const router = require('./routes/root');
const { fetchAndScheduleMeetings } = require('./scheduler/meetingScheduler');
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Initialize GridFS bucket after successful connection
        initBucket();

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(requestLogger);

        // Serve uploaded files
        // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        // Routes
        app.use(router);
        app.use('/api/meetings', meetingRoutes);
        // Basic health check route
        app.get('/health', (req, res) => {
            res.json({ status: 'ok' });
        });

        // Error handling middleware
        app.use(errorHandler);

        // Create uploads directory if it doesn't exist
        const fs = require('fs');
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        

        // Start the server
        app.listen(port, () => {
            fetchAndScheduleMeetings(); 
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));