const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive amount'],
        min: [0, 'Amount must be a positive number']
    },
    category: {
        type: String,
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Salary', 'Rent', 'Other'],
        default: 'Other'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);