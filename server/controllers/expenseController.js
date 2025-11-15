const Expense = require("../models/Expense");
const fs = require("fs");
const parse = require("csv-parse");
const { categorizeTransactions } = require("./aiController");

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
    });

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("Create Expense Error:", err);
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
      date: { $gte: start, $lt: end },
    });

    res.json(expenses);
  } catch (err) {
    console.error("Get Monthly Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

