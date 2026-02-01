const express = require('express');
const router = express.Router();

const { register, login, deleteAccount } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.delete('/delete-account', authMiddleware, deleteAccount);

module.exports = router;
