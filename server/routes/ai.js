const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getInsights,
  categorizeTransactions,
} = require("../controllers/aiController");

router.post("/categorize", auth, async (req, res) => {
  try {
    const items = req.body.items || [];
    const data = await categorizeTransactions(items);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "AI error" });
  }
});
router.get("/insights/:year/:month", auth, getInsights);

module.exports = router;
