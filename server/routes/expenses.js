const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createExpense,
  getMonthlyExpenses,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

router.post("/create", auth, createExpense);
router.get("/monthly/:year/:month", auth, getMonthlyExpenses);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);

module.exports = router;
