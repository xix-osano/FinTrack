const mongoose = require('mongoose');

const categories = {
  expense: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Rent', 'Other'],
  income: ['Salary', 'Freelancing', 'Investment', 'Gift', 'Other'],
};

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive amount'],
        min: [0, 'Amount must be a positive number']
    },
    type: {
        type: String, // 'expense' or 'income'
        required: true,
        enum: ['expense', 'income'], 
    },
    category: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
        // Use 'this' to access document context
        return categories[this.type]?.includes(value);
        },
        message: function (props) {
        return `${props.value} is not a valid category for type ${this.type}`;
        }
    }
    },
    date: {
        type: Date, 
        required: true,
    },
    timestamp: {
        type: Number, // For sorting, similar to Date.now()
        default: Date.now,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Transaction', transactionSchema);
