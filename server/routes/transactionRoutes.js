const express = require('express');
const { getTransactions, addTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware
const router = express.Router();

// Routes that require authentication (private routes)
router.route('/')
    .get(protect, getTransactions) // GET all transactions for the authenticated user
    .post(protect, addTransaction); // POST a new transaction for the authenticated user

router.route('/:id')
    .put(protect, updateTransaction) // PUT (update) a transaction by ID
    .delete(protect, deleteTransaction); // DELETE a transaction by ID

module.exports = router;