const express = require('express');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = { userId: req.userId };
    
    if (category) {
      query.category = category;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/api/expenses', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;
    
    const expense = new Expense({
      userId: req.userId,
      title,
      amount: parseFloat(amount),
      category,
      description,
      date: date ? new Date(date) : new Date()
    });
    
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;
    
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        title,
        amount: parseFloat(amount),
        category,
        description,
        date: date ? new Date(date) : new Date()
      },
      { new: true }
    );
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/api/expenses/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expense statistics
router.get('/api/expenses/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalExpenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      categoryStats: stats,
      totalAmount: totalExpenses[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;