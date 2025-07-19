const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

// Error handling middleware
app.use(errorHandler);

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});


module.exports = app;