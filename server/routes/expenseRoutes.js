const express = require('express');
const { getExpenses, addExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware
const router = express.Router();

// Routes that require authentication (private routes)
router.route('/')
    .get(protect, getExpenses) // GET all expenses for the authenticated user
    .post(protect, addExpense); // POST a new expense for the authenticated user

router.route('/:id')
    .put(protect, updateExpense) // PUT (update) an expense by ID
    .delete(protect, deleteExpense); // DELETE an expense by ID

module.exports = router;