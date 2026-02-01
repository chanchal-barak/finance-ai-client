const Expense = require("../models/Expense");

function generateMockInsights(total, categoryTotals) {
  const entries = Object.entries(categoryTotals);

  if (!entries.length) {
    return "No spending data available for analysis.";
  }

  const [topCategory, topAmount] = entries.sort(
    (a, b) => b[1] - a[1]
  )[0];

  const percent = ((topAmount / total) * 100).toFixed(1);

  let healthScore = 100 - Math.min(60, percent);
  healthScore = Math.max(30, Math.round(healthScore));

  return `
Top Spending Category: ${topCategory}

Summary:
You spent a total of ₹${total} this month. ${percent}% of your expenses went into ${topCategory}.

Risks:
1. High dependency on ${topCategory} spending.
2. Reduced flexibility for savings and emergencies.

Saving Tips:
• Set a monthly limit for ${topCategory}.
• Track daily expenses more frequently.
• Allocate at least 20% of income to savings.

Financial Health Score: ${healthScore}/100
`;
}

exports.categorizeTransactions = async (items) => {
  return items.map((item) => ({
    ...item,
    category: item.category || "Others",
  }));
};

exports.getInsights = async (req, res) => {
  try {
    const { year, month } = req.params;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const expenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: start, $lt: end },
    });

    if (!expenses.length) {
      return res.json({
        total: 0,
        categoryTotals: {},
        insights: "No expenses found for this month.",
      });
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = {};

    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + e.amount;
    });

    const insights = generateMockInsights(total, categoryTotals);

    res.json({
      total,
      categoryTotals,
      insights,
    });
  } catch (err) {
    console.error("Mock AI Error:", err.message);
    res.status(500).json({ message: "AI error" });
  }
};
