const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id,
      date: req.body.date || Date.now()
    });

    res.json(expense);
  } catch (err) {
    console.error("Create expense error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMonthlyExpenses = async (req, res) => {
  try {
    const { year, month } = req.params;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const expenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: start, $lt: end }
    });

    res.json(expenses);
  } catch (err) {
    console.error("Get monthly expenses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
