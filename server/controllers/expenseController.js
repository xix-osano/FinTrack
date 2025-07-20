const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    try {
        // req.user.id comes from the protect middleware
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    const { description, amount, category } = req.body;

    // Simple validation
    if (!description || !amount || amount <= 0) {
        return res.status(400).json({ msg: 'Please include a description and a positive amount' });
    }

    try {
        const newExpense = new Expense({
            user: req.user.id, // User ID from authenticated token
            description,
            amount,
            category: category || 'Other', // Default to 'Other' if not provided
        });

        const expense = await newExpense.save();
        res.status(201).json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    const { description, amount, category } = req.body;

    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        // Make sure the authenticated user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to update this expense' });
        }

        // Build update object
        const updateFields = {};
        if (description) updateFields.description = description;
        if (amount !== undefined && amount > 0) updateFields.amount = amount;
        if (category) updateFields.category = category;

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        // Make sure the authenticated user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this expense' });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
