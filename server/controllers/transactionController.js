const Transaction = require('../models/Transaction');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        // req.user.id comes from the protect middleware
        const transactions = await Transaction.find({ userID: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
    const { description, amount, type, category } = req.body;

    // Simple validation
    if (!description || !amount || amount <= 0) {
        return res.status(400).json({ msg: 'Please include a description and a positive amount' });
    }

    try {
        const newTransaction = new Transaction({
            description,
            amount,
            type, // 'expense' or 'income'
            category: category || (type === 'expense' ? 'Other' : 'Salary'), // Default to 'Other' for expenses, 'Salary' for income
            date: new Date(), // Current date
            timestamp: Date.now(), // For sorting, similar to Date.now()
            userID: req.user.id // Ensure userID is set for the transaction
        });

        const transaction = await newTransaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
    const { description, amount, type, category } = req.body;

    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Make sure the authenticated user owns the expense
        if (transaction.userID.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to update this transaction' });
        }

        // Build update object
        const updateFields = {};
        if (description) updateFields.description = description;
        if (amount !== undefined && amount > 0) updateFields.amount = amount;
        if (type) updateFields.type = type;
        if (category) updateFields.category = category;

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Make sure the authenticated user owns the transaction
        if (transaction.userID.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this transaction' });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
