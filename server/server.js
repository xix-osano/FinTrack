const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cors = require('cors'); // Import cors

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Enable CORS for all routes - important for frontend-backend communication
app.use(cors());
// Body parser for JSON requests
app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));