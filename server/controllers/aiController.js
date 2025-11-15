const OpenAI = require("openai");
const { openaiApiKey } = require("../config");
const Expense = require("../models/Expense");

const client = new OpenAI({
  apiKey: openaiApiKey
});

const fallbackCategories = [
  "Food","Travel","Shopping","Entertainment","Bills",
  "Subscriptions","Groceries","Transport","Income","Others"
];
async function categorizeItem(item) {
  const prompt = `
Classify the category of this transaction.

Transaction: "${item.title || item.description || ""}"

Choose ONLY ONE category from this list:
${fallbackCategories.join(", ")}

Return EXACTLY this JSON:
{"category":"CategoryName"}
`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 30
    });

    let text = resp.choices?.[0]?.message?.content?.trim() || "";

    const match = text.match(/{"category"\s*:\s*"([^"]+)"}/i);
    if (match) return match[1];

    return "Others";
  } catch (err) {
    console.error("AI categorize error:", err.message);
    return "Others";
  }
}

exports.categorizeTransactions = async (items) => {
  const results = [];
  for (const it of items) {
    const category = await categorizeItem(it);
    results.push({ ...it, category });
  }
  return results;
};

exports.getInsights = async (req, res) => {
  try {
    const { year, month } = req.params;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const expenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: start, $lt: end }
    });

    if (!expenses.length) {
      return res.json({
        total: 0,
        categoryTotals: {},
        insights: "No expenses found for this month."
      });
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categories = {};
    expenses.forEach((e) => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const prompt = `
You are a financial analytics assistant.

Based on the user's monthly expense data below, generate PROFESSIONAL, clear, and actionable insights.

Total Spending: ₹${total}

Category Breakdown:
${Object.entries(categories).map(([k,v]) => `${k}: ₹${v}`).join("\n")}

Provide insights in the EXACT format below:

Top Category
Explain which category is highest and why it may be high.

Summary
Describe spending habits and patterns.

Unusual Findings
Detect spikes, irregular activity, or risky trends.

Suggestions
- 3 easy and practical tips to save more

Forecast
Predict next month's spending range.

Financial Health Score
Give a score from 0–100 based on the data.
`;

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250
    });

    const insights =
      resp.choices?.[0]?.message?.content?.trim() || "No insights available.";

    res.json({
      total,
      categoryTotals: categories,
      insights
    });

  } catch (err) {
    console.error("AI Insights Error:", err);
    res.status(500).json({ message: "AI error" });
  }
};
