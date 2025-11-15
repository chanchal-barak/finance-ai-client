const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createExpense,
  getMonthlyExpenses,
} = require('../controllers/expenseController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/create', auth, createExpense);
router.get('/monthly/:year/:month', auth, getMonthlyExpenses);

module.exports = router;
