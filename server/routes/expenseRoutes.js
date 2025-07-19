const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Our custom auth middleware
const Expense = require('../models/Expense');

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
    const { description, amount, category } = req.body;

    try {
        const newExpense = new Expense({
            user: req.user.id, // User ID from auth middleware
            description,
            amount,
            category,
        });

        const expense = await newExpense.save();
        res.json(expense); // Return the saved expense
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/expenses
// @desc    Get all expenses for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 }); // Sort by newest first
        res.json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Ensure user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Expense.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
        res.json({ message: 'Expense removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') { // Handle invalid ID format
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;