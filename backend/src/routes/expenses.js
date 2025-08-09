const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Create expense
router.post('/api/expenses', auth, async (req, res) => {
  try {
    const { amount, currency, category, description, date, paymentMethod, recurring } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      currency,
      category,
      description,
      date,
      paymentMethod,
      recurring,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create expense.', error: err.message });
  }
});

// Get all user expenses (with optional filters)
router.get('/api/expenses', auth, async (req, res) => {
  try {
    const { from, to, category } = req.query;
    const filter = { userId: req.user.id };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (category) filter.category = category;
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses.', error: err.message });
  }
});

// Update expense (owner only)
router.put('/api/expenses/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    if (expense.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized.' });

    const updates = req.body;
    Object.assign(expense, updates);
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense.', error: err.message });
  }
});

// Delete expense (owner only)
router.delete('/api/expenses/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    if (expense.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized.' });

    await expense.remove();
    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense.', error: err.message });
  }
});

module.exports = router;